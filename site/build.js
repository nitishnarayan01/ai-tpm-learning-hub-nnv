/**
 * AI TPM Learning Hub - Build Script (ES Module)
 * Scans phases/levels and generates site/data.js and site/build-meta.js
 * Run: node site/build.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
const PHASES_DIR = path.join(REPO_ROOT, 'phases');
const OUTPUT_DATA_PATH = path.join(__dirname, 'data.js');
const OUTPUT_META_PATH = path.join(__dirname, 'build-meta.js');

// 13 Level definitions with canonical names
const LEVEL_DEFINITIONS = [
  { id: 0, name: "Level 0 — Technical Foundations for AI", desc: "Hardware architectures, GPUs vs CPUs, memory hierarchy, APIs, and dev environments." },
  { id: 1, name: "Level 1 — Programming & Software Engineering", desc: "Python fundamentals, data structures, async programming, and API engineering for AI." },
  { id: 2, name: "Level 2 — AI/ML Fundamentals", desc: "Math intuition, supervised vs unsupervised learning, neural networks, loss functions, and evaluation." },
  { id: 3, name: "Level 3 — Generative AI & LLMs", desc: "Transformers, attention mechanism, tokens, embeddings, pre-training, fine-tuning, and prompting." },
  { id: 4, name: "Level 4 — LLM Application Engineering", desc: "Prompt chaining, structured outputs, function calling, rate limiting, and token economics." },
  { id: 5, name: "Level 5 — RAG & Vector Databases", desc: "Chunking, vector embeddings, similarity search, reranking, and RAG evaluation frameworks." },
  { id: 6, name: "Level 6 — AI Agents", desc: "ReAct patterns, autonomous planning, memory architectures, tool use, and multi-agent coordination." },
  { id: 7, name: "Level 7 — MCP & AI Tool Integration", desc: "Model Context Protocol architecture, building custom MCP servers, and enterprise integrations." },
  { id: 8, name: "Level 8 — Production AI", desc: "LLMOps, observability, tracing (Langfuse), guardrails, evals, latency optimization, and CI/CD." },
  { id: 9, name: "Level 9 — AI Product Management", desc: "Problem-model fit, PRDs for probabilistic software, AI UX patterns, and business metrics." },
  { id: 10, name: "Level 10 — AI Technical Program Management", desc: "Architecture reviews, technical risk management, capacity planning, and engineering leadership." },
  { id: 11, name: "Level 11 — Advanced AI", desc: "Fine-tuning (LoRA/QLoRA), Small Language Models, reasoning models, and multimodal architectures." },
  { id: 12, name: "Level 12 — Portfolio / Capstone", desc: "End-to-end AI system design, proof-of-concept implementation, and executive TPM presentation." }
];

function extractTitleAndSummary(markdownPath) {
  if (!fs.existsSync(markdownPath)) return { title: '', summary: '' };
  const content = fs.readFileSync(markdownPath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  let title = '';
  let summary = '';

  for (const line of lines) {
    if (!title && line.startsWith('# ')) {
      title = line.replace(/^#\s+/, '').trim();
    } else if (title && !summary && line.startsWith('>')) {
      summary = line.replace(/^>\s*/, '').trim();
      break;
    }
  }

  return { title, summary };
}

function buildCurriculum() {
  console.log('Building AI TPM Learning Hub curriculum data...');

  const phases = LEVEL_DEFINITIONS.map(levelDef => ({
    id: levelDef.id,
    name: levelDef.name,
    status: "planned",
    desc: levelDef.desc,
    lessons: []
  }));

  if (fs.existsSync(PHASES_DIR)) {
    const phaseFolders = fs.readdirSync(PHASES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    for (const phaseFolder of phaseFolders) {
      const match = phaseFolder.match(/^(\d+)/);
      if (!match) continue;
      const phaseId = parseInt(match[1], 10);
      const phaseObj = phases.find(p => p.id === phaseId);
      if (!phaseObj) continue;

      const phasePath = path.join(PHASES_DIR, phaseFolder);
      const lessonFolders = fs.readdirSync(phasePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort();

      for (const lessonFolder of lessonFolders) {
        const docPath = path.join(phasePath, lessonFolder, 'docs', 'en.md');
        const { title, summary } = extractTitleAndSummary(docPath);
        
        const fallbackName = lessonFolder.replace(/^\d+-/, '').replace(/-/g, ' ');
        const lessonName = title || (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1));
        const relUrl = `phases/${phaseFolder}/${lessonFolder}/`;

        phaseObj.lessons.push({
          name: lessonName,
          status: fs.existsSync(docPath) ? "complete" : "planned",
          type: "Learn",
          lang: "Python",
          url: relUrl,
          summary: summary || "Master the concepts and TPM implications for this topic.",
          keywords: "AI Architecture · Engineering Evaluation · TPM Leadership"
        });
      }

      if (phaseObj.lessons.length > 0 && phaseObj.lessons.every(lesson => lesson.status === "complete")) {
        phaseObj.status = "complete";
      }
    }
  }

  const roadmapPrereqs = {};
  for (let i = 0; i < LEVEL_DEFINITIONS.length; i++) {
    roadmapPrereqs[String(i)] = i === 0 ? [] : [i - 1];
  }

  const learningPaths = [
    {
      id: "tpm-executive-accelerator",
      title: "AI TPM Core Track",
      tagline: "The essential path from Technical Foundations to Production AI Systems and Program Leadership.",
      lessons: [
        "phases/00-technical-foundations/01-how-computers-and-gpus-work",
        "phases/00-technical-foundations/02-memory-hierarchy-and-context-windows",
        "phases/00-technical-foundations/03-apis-and-rate-limits",
        "phases/00-technical-foundations/04-dev-environments-for-ai",
        "phases/01-programming-and-software-engineering/01-programming-fundamentals",
        "phases/01-programming-and-software-engineering/02-python-fundamentals",
        "phases/01-programming-and-software-engineering/03-data-structures",
        "phases/01-programming-and-software-engineering/04-functions-and-modules",
        "phases/01-programming-and-software-engineering/05-apis-and-json",
        "phases/01-programming-and-software-engineering/06-async-programming",
        "phases/01-programming-and-software-engineering/07-database-basics",
        "phases/01-programming-and-software-engineering/08-software-engineering-fundamentals",
        "phases/01-programming-and-software-engineering/09-git-and-github-workflow",
        "phases/01-programming-and-software-engineering/10-api-engineering-for-ai-applications",
        "phases/02-ai-ml-fundamentals/01-math-intuition-for-ai",
        "phases/02-ai-ml-fundamentals/02-supervised-vs-unsupervised-learning",
        "phases/02-ai-ml-fundamentals/03-neural-networks-basics",
        "phases/02-ai-ml-fundamentals/04-loss-functions-and-optimization",
        "phases/02-ai-ml-fundamentals/05-model-evaluation-and-metrics",
        "phases/03-generative-ai-and-llms/01-tokens-and-embeddings",
        "phases/03-generative-ai-and-llms/02-transformers-and-attention",
        "phases/03-generative-ai-and-llms/03-pretraining-how-llms-learn-language",
        "phases/03-generative-ai-and-llms/04-fine-tuning-and-alignment",
        "phases/03-generative-ai-and-llms/05-prompting-and-prompt-engineering",
        "phases/04-llm-application-engineering/01-prompt-chaining",
        "phases/04-llm-application-engineering/02-structured-outputs",
        "phases/04-llm-application-engineering/03-function-calling-and-tool-use",
        "phases/04-llm-application-engineering/04-rate-limiting-in-practice",
        "phases/04-llm-application-engineering/05-token-economics",
        "phases/05-rag-and-vector-databases/01-chunking-strategies",
        "phases/05-rag-and-vector-databases/02-vector-embeddings-in-practice",
        "phases/05-rag-and-vector-databases/03-similarity-search",
        "phases/05-rag-and-vector-databases/04-reranking",
        "phases/05-rag-and-vector-databases/05-rag-evaluation-frameworks",
        "phases/06-ai-agents/01-react-reasoning-and-acting",
        "phases/06-ai-agents/02-autonomous-planning",
        "phases/06-ai-agents/03-memory-architectures-for-agents",
        "phases/06-ai-agents/04-tool-use-in-agentic-systems",
        "phases/06-ai-agents/05-multi-agent-coordination",
        "phases/07-mcp-and-ai-tool-integration/01-what-is-mcp-and-why-it-exists",
        "phases/07-mcp-and-ai-tool-integration/02-mcp-architecture-clients-servers-transports",
        "phases/07-mcp-and-ai-tool-integration/03-building-custom-mcp-servers",
        "phases/07-mcp-and-ai-tool-integration/04-enterprise-mcp-integration",
        "phases/08-production-ai/01-llmops-fundamentals",
        "phases/08-production-ai/02-observability-and-tracing",
        "phases/08-production-ai/03-guardrails-and-safety-controls",
        "phases/08-production-ai/04-evals-in-production",
        "phases/08-production-ai/05-latency-optimization",
        "phases/08-production-ai/06-cicd-for-ai-systems",
        "phases/09-ai-product-management/01-problem-model-fit",
        "phases/09-ai-product-management/02-prds-for-probabilistic-software",
        "phases/09-ai-product-management/03-ai-ux-patterns",
        "phases/09-ai-product-management/04-business-metrics-for-ai-products",
        "phases/10-ai-technical-program-management/01-leading-architecture-reviews",
        "phases/10-ai-technical-program-management/02-technical-risk-management",
        "phases/10-ai-technical-program-management/03-capacity-planning-for-ai-infrastructure",
        "phases/10-ai-technical-program-management/04-engineering-leadership-for-ai-teams",
        "phases/11-advanced-ai/01-parameter-efficient-fine-tuning-lora-qlora",
        "phases/11-advanced-ai/02-small-language-models",
        "phases/11-advanced-ai/03-reasoning-models",
        "phases/11-advanced-ai/04-multimodal-architectures"
      ]
    }
  ];

  const glossaryCategories = [
    "Hardware & Compute",
    "LLM Architectures",
    "Program Leadership & Metrics"
  ];

  const glossary = [
    {
      term: "VRAM",
      category: "Hardware & Compute",
      definition: "Video Random Access Memory: specialized ultra-high-speed memory mounted directly on the GPU, dictating model parameter capacity and batch sizes."
    },
    {
      term: "Time to First Token (TTFT)",
      category: "Program Leadership & Metrics",
      definition: "The latency between an API call and the initial streamed response token, representing initial UI responsiveness to the end user."
    }
  ];

  // Not ready for learners yet — omit from the visible curriculum grid until scoped.
  const HIDDEN_LEVEL_IDS = [12];
  const visiblePhases = phases.filter(phase => !HIDDEN_LEVEL_IDS.includes(phase.id));

  const dataJsContent = `// Auto-generated by site/build.js — do not edit manually.
// Last built: ${new Date().toISOString()}

const ROADMAP_PREREQS = ${JSON.stringify(roadmapPrereqs, null, 2)};

const PHASES = ${JSON.stringify(visiblePhases, null, 2)};

const LEARNING_PATHS = ${JSON.stringify(learningPaths, null, 2)};

const GLOSSARY_CATEGORY_ORDER = ${JSON.stringify(glossaryCategories, null, 2)};

const GLOSSARY = ${JSON.stringify(glossary, null, 2)};

const ARTIFACTS = [];
`;

  fs.writeFileSync(OUTPUT_DATA_PATH, dataJsContent, 'utf8');
  console.log(`Successfully generated ${OUTPUT_DATA_PATH}`);

  const metaContent = `window.__AIFS_REF = 'main';
window.__AIFS_SOURCE = {
  owner: 'nitishnarayan01',
  repo: 'ai-tpm-learning-hub-nnv',
  revision: 'main'
};
`;
  fs.writeFileSync(OUTPUT_META_PATH, metaContent, 'utf8');
  console.log(`Successfully generated ${OUTPUT_META_PATH}`);
}

buildCurriculum();
