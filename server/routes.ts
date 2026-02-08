import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const AWS_API_BASE = 'https://1fdhytb3jl.execute-api.us-east-1.amazonaws.com/prod';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post('/api/aws/match', async (req, res) => {
    try {
      const response = await fetch(`${AWS_API_BASE}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(502).json({ error: 'Failed to reach AWS match endpoint' });
    }
  });

  app.post('/api/aws/coach', async (req, res) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 55000);
      const response = await fetch(`${AWS_API_BASE}/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(502).json({ error: 'Failed to reach AWS coach endpoint' });
    }
  });

  app.post('/api/aws/analyze-gap', async (req, res) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 55000);
      const response = await fetch(`${AWS_API_BASE}/analyze-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(502).json({ error: 'Failed to reach AWS analyze-gap endpoint' });
    }
  });

  app.post('/api/aws/tailor-resume', async (req, res) => {
    try {
      const response = await fetch(`${AWS_API_BASE}/tailor-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(502).json({ error: 'Failed to reach AWS tailor-resume endpoint' });
    }
  });

  app.post('/api/aws/aggregate-jobs', async (req, res) => {
    try {
      const response = await fetch(`${AWS_API_BASE}/aggregate-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(502).json({ error: 'Failed to reach AWS aggregate-jobs endpoint' });
    }
  });

  return httpServer;
}
