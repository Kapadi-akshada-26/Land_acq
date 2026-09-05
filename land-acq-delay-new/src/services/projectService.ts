// src/services/projectService.ts
import { USE_MOCK, apiFetch } from "./api";
import dataset from "@/data/processedProjects.json";
import type { Project } from "@/types";

const projectsList = dataset.projects as Project[];

export async function getProjects(): Promise<Project[]> {
  if (USE_MOCK) return projectsList;
  try {
    return await apiFetch<Project[]>("/api/projects");
  } catch {
    return projectsList;
  }
}

export async function getProject(id: string): Promise<Project> {
  if (USE_MOCK) {
    const project = projectsList.find((p) => p.id === id);
    if (!project) throw new Error(`Project ${id} not found`);
    return project;
  }
  try {
    return await apiFetch<Project>(`/api/projects/${id}`);
  } catch {
    const project = projectsList.find((p) => p.id === id);
    if (!project) throw new Error(`Project ${id} not found`);
    return project;
  }
}

export async function getTopRiskyProjects(limit = 5): Promise<Project[]> {
  const topRisky = [...projectsList]
    .sort((a, b) => b.delayProbability - a.delayProbability)
    .slice(0, limit);
  if (USE_MOCK) return topRisky;
  try {
    return await apiFetch<Project[]>(`/api/projects/top-risky?limit=${limit}`);
  } catch {
    return topRisky;
  }
}

export async function getGISProjects(): Promise<Project[]> {
  const geoProjects = projectsList.filter((p) => p.lat && p.lng);
  if (USE_MOCK) return geoProjects;
  try {
    return await apiFetch<Project[]>("/api/projects/gis");
  } catch {
    return geoProjects;
  }
}

