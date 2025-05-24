import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get Form Data Endpoint
app.get('/api/form', async (req, res) => {
  try {
    const { userId } = req.query;
    // console.log('Server - GET /api/form - Request received for userId:', userId);
    
    if (!userId) {
      // console.log('Server - GET /api/form - Missing userId');
      return res.status(400).json({ error: 'Missing user ID' });
    }
    
    // Find or create a submission for this user
    let submission = await prisma.formSubmission.findFirst({
      where: { userId },
      include: { 
        projects: true,
      },
    });
    
    // console.log('Server - GET /api/form - Found submission:', submission);
    
    if (!submission) {
      // console.log('Server - GET /api/form - Creating new submission for userId:', userId);
      submission = await prisma.formSubmission.create({
        data: { 
          userId,
          name: '',
          email: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipcode: '',
          isStudying: false,
          institution: '',
        },
        include: { 
          projects: true,
        },
      });
    }
    
    // console.log('Server - GET /api/form - Sending response:', submission);
    res.status(200).json(submission);
  } catch (error) {
    // console.error('Server - GET /api/form - Error:', error);
    res.status(500).json({ error: 'Failed to fetch form data' });
  }
});

// Personal Info Endpoint
app.post(
  '/api/form/personal',
  [
    body('name').optional().isString().isLength({ min: 2 }),
    body('email').optional().isEmail(),
    body('addressLine1').optional().isString().isLength({ min: 5 }),
    body('addressLine2').optional().isString(),
    body('city').optional().isString().isLength({ min: 2 }),
    body('state').optional().isString().isLength({ min: 2 }),
    body('zipcode').optional().matches(/^\d{5}(-\d{4})?$/),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id, userId, ...data } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
      }
      
      let submission;
      
      if (id) {
        // Verify the submission belongs to the user
        const existingSubmission = await prisma.formSubmission.findFirst({
          where: { id, userId },
        });
        
        if (!existingSubmission) {
          return res.status(403).json({ error: 'Unauthorized' });
        }
        
        // Update existing submission
        submission = await prisma.formSubmission.update({
          where: { id },
          data,
        });
      } else {
        // Create new submission
        submission = await prisma.formSubmission.create({
          data: {
            ...data,
            userId,
          },
        });
      }
      
      res.status(200).json(submission);
    } catch (error) {
      // console.error('Error saving personal info:', error);
      res.status(500).json({ error: 'Failed to save personal information' });
    }
  }
);

// Education Endpoint
app.post(
  '/api/form/education',
  [
    body('isStudying').isBoolean(),
    body('institution').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Institution must be a string'),
    body('id').isString(),
    body('userId').isString(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id, userId, ...data } = req.body;
      // console.log('Server - POST /api/form/education - Request received:', { id, userId, data });
      // console.log('Server - POST /api/form/education - Validation errors:', validationResult(req).array());
      
      if (!id || !userId) {
        // console.log('Server - POST /api/form/education - Missing id or userId');
        return res.status(400).json({ error: 'Missing submission ID or user ID' });
      }
      
      // Verify the submission belongs to the user
      const existingSubmission = await prisma.formSubmission.findFirst({
        where: { id, userId },
      });
      
      // console.log('Server - POST /api/form/education - Found existing submission:', existingSubmission);
      
      if (!existingSubmission) {
        // console.log('Server - POST /api/form/education - Unauthorized access attempt');
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      // If isStudying is false, set institution to null
      const educationData = {
        isStudying: data.isStudying,
        institution: data.isStudying ? data.institution : null,
      };
      
      // console.log('Server - POST /api/form/education - Updating with data:', educationData);
      
      const submission = await prisma.formSubmission.update({
        where: { id },
        data: educationData,
      });
      
      // console.log('Server - POST /api/form/education - Updated submission:', submission);
      res.status(200).json(submission);
    } catch (error) {
      // console.error('Server - POST /api/form/education - Error:', error);
      res.status(500).json({ error: 'Failed to save education information' });
    }
  }
);

// Projects Endpoint
app.post(
  '/api/form/projects',
  [
    body('projects').isArray(),
    body('projects.*.id').isString(),
    body('projects.*.name').isString().isLength({ min: 2 }),
    body('projects.*.description').isString().isLength({ min: 10 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id, userId, projects } = req.body;
      
      if (!id || !userId) {
        return res.status(400).json({ error: 'Missing submission ID or user ID' });
      }
      
      // Verify the submission belongs to the user
      const existingSubmission = await prisma.formSubmission.findFirst({
        where: { id, userId },
      });
      
      if (!existingSubmission) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      // Delete existing projects for this submission
      await prisma.project.deleteMany({
        where: { submissionId: id },
      });
      
      // Create new projects
      const projectPromises = projects.map(project => {
        return prisma.project.create({
          data: {
            name: project.name,
            description: project.description,
            submissionId: id,
          },
        });
      });
      
      await Promise.all(projectPromises);
      
      // Update the submission's updatedAt timestamp
      const submission = await prisma.formSubmission.update({
        where: { id },
        data: { updatedAt: new Date() },
        include: { projects: true },
      });
      
      res.status(200).json(submission);
    } catch (error) {
      // console.error('Error saving projects:', error);
      res.status(500).json({ error: 'Failed to save projects' });
    }
  }
);

// Submit Form Endpoint
app.post('/api/form/submit', async (req, res) => {
  try {
    const { id, userId } = req.body;
    
    if (!id || !userId) {
      return res.status(400).json({ error: 'Missing submission ID or user ID' });
    }
    
    // Verify the submission belongs to the user
    const existingSubmission = await prisma.formSubmission.findFirst({
      where: { id, userId },
    });
    
    if (!existingSubmission) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Just update the timestamp to mark as submitted
    const submission = await prisma.formSubmission.update({
      where: { id },
      data: { updatedAt: new Date() },
      include: { projects: true },
    });
    
    res.status(200).json(submission);
  } catch (error) {
    // console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Start the server
app.listen(PORT, () => {
  //console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});