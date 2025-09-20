import { Request, Response } from "express";
import { extractJD, saveManualJD } from "../services/jdService";

export const extractJDController = async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  try {
    const data = await extractJD(url);
    if (!data.jobDescription) {
      return res.json({ message: "Job description not found!" });
    }
    res.json({ message: "JD extracted successfully", data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const saveManualJDController = async (req: Request, res: Response) => {
  const { url, jobDescription } = req.body;
  if (!url || !jobDescription) {
    return res.status(400).json({ error: "URL and job description are required" });
  }
  try {
    const data = await saveManualJD(url, jobDescription);
    res.json({ message: "Manual JD saved successfully", data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
