/**
 * Typing Corpus & Test Paragraphs Repository
 * Categorized by professional domain benchmarks
 */

export interface TextCategory {
  id: string;
  name: string;
  description: string;
  texts: string[];
}

export const TYPING_CATEGORIES: TextCategory[] = [
  {
    id: 'architecture',
    name: 'Tech & Architecture',
    description: 'Cloud systems, distributed consensus, microservices, and concurrency.',
    texts: [
      'Modern web architectures require strict decoupling between presentation layers and state-authoritative backends. By processing keystroke telemetry through statistical variance pipelines, high-throughput engines achieve deterministic fraud detection without imposing perceptible latency on touch-typists.',
      'Distributed systems enforce eventual consistency through asynchronous consensus protocols like Raft and Paxos. When designing fault-tolerant databases, engineers must balance network partition tolerance against serializable isolation levels to eliminate race conditions.',
      'Container orchestration platforms abstract bare metal infrastructure into scalable pools of compute. Efficient deployment pipelines leverage declarative manifests and immutable artifacts to ensure idempotent rollbacks across heterogeneous cloud environments.',
    ],
  },
  {
    id: 'legal',
    name: 'Legal & Court Reporting',
    description: 'Verbatim court transcripts, contractual covenants, and evidentiary motions.',
    texts: [
      'The certified transcript represents an accurate verbatim record of testimony presented before the administrative tribunal. Speed and mechanical consistency remain paramount, ensuring every spoken syllable is captured with verified fidelity and cryptographic chain of custody.',
      'Counsel for the plaintiff hereby submits this motion for summary judgment on the grounds that no genuine issue of material fact remains for determination by the trier of fact. The undisputed evidentiary record conclusively demonstrates statutory compliance.',
      'The parties agree that neither the execution nor performance of this agreement shall constitute a waiver of any preexisting intellectual property covenants. All proprietary disclosures shall remain confidential under strict non-disclosure obligations.',
    ],
  },
  {
    id: 'medical',
    name: 'Medical & Clinical',
    description: 'Clinical dictation, surgical pathology, pharmacology, and patient prognosis.',
    texts: [
      'Patient presents with acute exacerbation of chronic obstructive pulmonary disease alongside secondary hypertension. Auscultation reveals bilateral expiratory wheezing across lower lung bases, requiring intravenous bronchodilator therapy and immediate continuous pulse oximetry monitoring.',
      'Postoperative evaluation confirms successful laparoscopic cholecystectomy without anatomical complications. Hemostasis was achieved via electrocautery, and vital signs remained stable throughout endotracheal anesthesia recovery.',
      'Pharmacological intervention commenced with broad-spectrum cephalosporins following blood cultures. Renal function panels indicate normal glomerular filtration rate, with serum electrolytes remaining within therapeutic reference intervals.',
    ],
  },
  {
    id: 'literature',
    name: 'Literature & Philosophy',
    description: 'Classic philosophical treatises and literary prose.',
    texts: [
      'Swift fingers moved across the mechanical switches with rhythmic precision. Each stroke resonated with clockwork cadence, transforming thoughts into fluid streams of alphanumeric characters while the digital proctor silently verified the natural biomechanical variance of human hands.',
      'You have power over your mind, not outside events. Realize this, and you will find strength. The happiness of your life depends upon the quality of your thoughts, and what we do now echoes in eternity.',
      'It was a bright cold day in April, and the clocks were striking thirteen. The sky was the color of television, tuned to a dead channel, whispering tales of forgotten machines humming in the quiet hours of night.',
    ],
  },
  {
    id: 'code',
    name: 'Code Typing (TypeScript)',
    description: 'Real syntax, brackets, arrow functions, and typed declarations.',
    texts: [
      'async function verifyCertificate(publicCode: string): Promise<VerificationResult> { const record = await db.query.certificates.findFirst({ where: eq(certificates.publicCode, publicCode) }); if (!record) return { isValid: false, error: "Not Found" }; return { isValid: true, record }; }',
      'export const rateLimiter = (maxRequests: number, windowMs: number) => { const bucket = new Map<string, number[]>(); return (req: Request, res: Response, next: NextFunction) => { const now = Date.now(); const ip = req.ip || "unknown"; next(); }; };',
      'const computeMetrics = (typed: string, target: string, durationSec: number) => { const words = typed.length / 5; const grossWpm = Math.round((words / durationSec) * 60); const errors = countErrors(typed, target); return { grossWpm, errors }; };',
    ],
  },
];

export const BENCHMARK_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
];

export function generateWordTest(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomWord = BENCHMARK_WORDS[Math.floor(Math.random() * BENCHMARK_WORDS.length)];
    words.push(randomWord);
  }
  return words.join(' ');
}
