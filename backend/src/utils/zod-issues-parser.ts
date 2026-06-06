import z from "zod";

type IssuesType = z.core.$ZodIssue;

export function parseIssue(issue: IssuesType[]) {
  return { error: true, message: issue[0].message };
}
