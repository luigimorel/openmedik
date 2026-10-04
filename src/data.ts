export const starterPrompts = [
  {
    title: "Explain a concept",
    prompt: "Explain a medical concept in plain language.",
  },
  {
    title: "Review the evidence",
    prompt: "Help me understand the evidence around a medical topic.",
  },
  {
    title: "Draft a handout",
    prompt: "Help me draft clear, patient-friendly health information.",
  },
  {
    title: "Think through a question",
    prompt: "Help me think through a clinical question.",
  },
];

export const chatModes: {
  value: "diagnosis" | "operation" | "medication";
  label: string;
}[] = [
  { value: "diagnosis", label: "Diagnosis" },
  { value: "operation", label: "Operation" },
  { value: "medication", label: "Medication info" },
];
