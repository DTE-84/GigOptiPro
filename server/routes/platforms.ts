import { RequestHandler } from "express";
import { MOCK_PLATFORMS, PlatformData } from "@shared/api";

export const handleGetPlatforms: RequestHandler = (_req, res) => {
  // In a real app, this might fetch from an external API or database
  // and apply some logic based on the time of day.
  res.json(MOCK_PLATFORMS);
};
