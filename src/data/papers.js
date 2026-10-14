// Plain ESM (no JSX) so scripts/generate-seo-files.mjs can import it.
export const papers = [
  {
    slug: "data-structures-java-sem2",
    title: "Data Structures in Java: Semester 2 Sample Paper",
    subject: "Data Structures",
    level: "Undergraduate, Sem 2",
    marks: 60,
    minutes: 120,
    summary:
      "A 60-mark sample paper covering arrays, linked lists, stacks, queues, trees and sorting, with answer hints.",
    topics: ["Arrays", "Linked lists", "Stacks", "Queues", "Binary trees", "Sorting"],
    sections: [
      {
        name: "Section A: Multiple choice",
        marks: "10 x 1",
        questions: [
          "Which data structure follows the First In, First Out principle?",
          "What is the worst-case time complexity of searching in a singly linked list?",
          "Which traversal of a binary search tree gives sorted output?",
        ],
      },
      {
        name: "Section B: Short answer",
        marks: "5 x 4",
        questions: [
          "Differentiate between a linear queue and a circular queue.",
          "Write the Java method to push an element onto an array-based stack.",
          "Explain overflow and underflow with one example each.",
        ],
      },
      {
        name: "Section C: Long answer",
        marks: "2 x 10",
        questions: [
          "Implement a circular queue in Java with enqueue, dequeue and display. Explain how the rear pointer wraps around.",
          "Explain insertion, deletion and traversal in a binary search tree with a worked example.",
        ],
      },
    ],
  },
  {
    slug: "professional-communication-ethics",
    title: "Professional Communication and Ethics: Sample Paper",
    subject: "Professional Communication",
    level: "Undergraduate, Sem 2",
    marks: 50,
    minutes: 90,
    summary:
      "A 50-mark sample paper on workplace communication, presentations, ethics and interview skills.",
    topics: ["Presentations", "Report writing", "Workplace ethics", "Interviews"],
    sections: [
      {
        name: "Section A: Short answer",
        marks: "5 x 2",
        questions: [
          "Define active listening.",
          "List two barriers to effective communication.",
          "What is the purpose of a one-page resume?",
        ],
      },
      {
        name: "Section B: Descriptive",
        marks: "4 x 10",
        questions: [
          "Explain the structure of an effective group presentation.",
          "Discuss why ethics matter in engineering practice, with two examples.",
        ],
      },
    ],
  },
  {
    slug: "engineering-mathematics-2",
    title: "Engineering Mathematics 2: Sample Paper",
    subject: "Engineering Mathematics",
    level: "Undergraduate, Sem 2",
    marks: 80,
    minutes: 180,
    summary:
      "An 80-mark sample paper on differential equations, Laplace transforms and vector calculus.",
    topics: ["Differential equations", "Laplace transforms", "Vector calculus"],
    sections: [
      {
        name: "Section A: Short answer",
        marks: "10 x 2",
        questions: [
          "State the existence condition for the Laplace transform of a function.",
          "Define the divergence of a vector field.",
        ],
      },
      {
        name: "Section B: Problems",
        marks: "4 x 15",
        questions: [
          "Solve the differential equation d2y/dx2 + 4y = sin 2x.",
          "Find the Laplace transform of t * e^(-3t) * cos 2t.",
        ],
      },
    ],
  },
];
