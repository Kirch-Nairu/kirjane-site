// Blueprint V1.0, editorial section 06. Services still need final company approval.
// Focus points are descriptive draft copy, not a statement of verified past deliveries.
export const services = [
  {
    number: "01",
    title: "Custom Software Development",
    description: "Applications built around specific workflows and requirements.",
    question: "What does the work need to do?",
    focus: ["Workflow-specific applications", "Usable interfaces", "Clear operating requirements"],
  },
  {
    number: "02",
    title: "Process Automation",
    description: "Reducing repetitive tasks and improving the movement of information.",
    question: "Where does time get lost?",
    focus: ["Repeated manual steps", "Information handoffs", "Reliable routine tasks"],
  },
  {
    number: "03",
    title: "Systems Engineering & Integration",
    description: "Designing technical solutions and connecting systems where needed.",
    question: "Which systems need to work together?",
    focus: ["System boundaries", "Data movement", "Integration requirements"],
  },
  {
    number: "04",
    title: "Technical Infrastructure & Support",
    description: "Supporting the environments and services that software depends on.",
    question: "What keeps the system dependable?",
    focus: ["Deployment readiness", "Operational environments", "Maintainability"],
  },
];

export const processSteps = [
  { number: "01", title: "Discover", detail: "Learn about the people, processes, and challenges involved.", question: "What problem are we actually solving?" },
  { number: "02", title: "Plan & Design", detail: "Translate requirements into a clear technical and visual direction.", question: "What should the experience and system look like?" },
  { number: "03", title: "Develop", detail: "Build the solution against agreed scope and requirements.", question: "How do the parts work together?" },
  { number: "04", title: "Validate", detail: "Check intended behavior and requirements.", question: "Does the result do what it needs to do?" },
  { number: "05", title: "Deliver & Support", detail: "Prepare deployment, handover, and support under agreed terms.", question: "How will it be used and maintained?" },
];
