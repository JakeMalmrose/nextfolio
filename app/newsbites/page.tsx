'use client';

import { useState } from 'react';
// import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  categories: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export default function NewsBites() {
  const [_articles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'AI Breakthroughs Expected to Transform Healthcare in Coming Decade',
      source: 'Tech Insights',
      date: 'Mar 15, 2025',
      summary: 'Researchers predict that artificial intelligence will revolutionize healthcare through improved diagnostics, personalized treatment plans, and drug discovery acceleration. Several ongoing studies show promising early results.',
      categories: ['Technology', 'Healthcare', 'AI'],
      sentiment: 'positive'
    },
    {
      id: '2',
      title: 'Global Markets Respond to Recent Fed Rate Decision',
      source: 'Financial Times',
      date: 'Mar 16, 2025',
      summary: 'Markets across Asia and Europe showed mixed reactions following the Federal Reserve\'s decision to maintain current interest rates. Analysts suggest this indicates confidence in economic stability despite inflation concerns.',
      categories: ['Finance', 'Economy', 'Global Markets'],
      sentiment: 'neutral'
    },
    {
      id: '3',
      title: 'Climate Report Warns of Accelerating Glacier Melt',
      source: 'Environmental Journal',
      date: 'Mar 14, 2025',
      summary: 'A newly released climate study indicates that glacier melt rates have increased by 25% compared to previous estimates. Scientists warn that this could lead to more rapid sea level rise than previously projected.',
      categories: ['Environment', 'Climate Change'],
      sentiment: 'negative'
    },
    {
      id: '4',
      title: 'New Quantum Computing Milestone Achieved',
      source: 'Science Weekly',
      date: 'Mar 17, 2025',
      summary: 'Researchers have demonstrated quantum supremacy in a new class of problems previously thought to be decades away from practical solution. This breakthrough could accelerate advancements in materials science and cryptography.',
      categories: ['Science', 'Technology', 'Quantum Computing'],
      sentiment: 'positive'
    },
    {
      id: '5',
      title: 'Global Supply Chain Disruptions Continue to Affect Manufacturing',
      source: 'Industry Today',
      date: 'Mar 13, 2025',
      summary: 'Manufacturing companies worldwide report continued challenges due to supply chain disruptions. Semiconductor shortages in particular are causing production delays across multiple sectors.',
      categories: ['Business', 'Manufacturing', 'Global Trade'],
      sentiment: 'negative'
    }
  ]);

  const _getSentimentClass = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-green-800 bg-opacity-20 text-green-400';
      case 'negative': return 'bg-red-800 bg-opacity-20 text-red-400';
      default: return 'bg-gray-800 bg-opacity-20 text-gray-400';
    }
  };

  return (
    <div className="mt-8 mb-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          NewsBites
        </h1>
        <p className="max-w-2xl mx-auto">
          AI-powered news summarization platform that delivered concise, informative summaries of important news stories.
          This project was completed as my senior capstone at Neumont College of Computer Science in December 2024.
        </p>
        <div className="mt-6">
          <a
            href="https://news.malmrose.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-primary text-background font-medium rounded-md hover:opacity-90 transition"
          >
            Visit Live Site
          </a>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <div className="paper">
          <p className="mb-4">
            NewsBites is an AI-powered news aggregation and summarization platform built to help users stay informed
            without information overload. The platform uses advanced natural language processing to extract key information
            from articles and present it in a concise, easy-to-digest format.
          </p>
          <p className="mb-4">
            Using a combination of local Llama models, third-party AI providers (Anthropic and OpenAI), and integration with a 
            third-party news aggregator, NewsBites provides high-quality summaries with topic categorization and personalized feeds.
            The platform processes thousands of articles daily and uses advanced prefetching and caching to achieve ultra-low latency.
            I've optimized costs by choosing the right LLM for each task, while keeping the output quality high.
          </p>
          <p>
            This project was developed as part of my Neumont College senior capstone, showcasing skills in
            full-stack development, AI integration, and scalable cloud architecture.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">AI-Powered Summaries</h3>
            <p>
              Articles are automatically summarized using advanced NLP models, extracting
              the most relevant information while preserving context and key details.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Customized News Feeds</h3>
            <p>
              Users can build personalized news feeds by interacting with an LLM that 
              uses tool calling to create a tailored news experience based on preferences.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Topic Categorization</h3>
            <p>
              Stories are automatically categorized into relevant topics, making it easy
              to browse news that matters to you.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Ultra-Low Latency</h3>
            <p>
              Advanced prefetching, caching techniques, and optimized prompt engineering deliver
              summaries with average response times of 100ms or less, with only occasional outliers.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
        <div className="paper">
          <div className="flex flex-wrap gap-2">
            <span className="chip chip-primary">React</span>
            <span className="chip chip-primary">TypeScript</span>
            <span className="chip chip-primary">AWS</span>
            <span className="chip chip-primary">Amplify</span>
            <span className="chip chip-primary">Lambda</span>
            <span className="chip chip-primary">DynamoDB</span>
            <span className="chip chip-primary">CloudFront</span>
            <span className="chip chip-primary">Generative AI</span>
            <span className="chip chip-primary">NLP</span>
            <span className="chip chip-primary">Local LLM</span>
            <span className="chip chip-primary">Anthropic API</span>
            <span className="chip chip-primary">OpenAI API</span>
            <span className="chip chip-primary">News APIs</span>
          </div>
        </div>
      </div>

      {/* Sample News Feed section commented out for now
      <div>
        <h2 className="text-2xl font-bold mb-4">Sample News Feed</h2>
        <div className="space-y-6">
          {articles.map(article => (
            <div key={article.id} className="paper">
              <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-70">{article.date}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSentimentClass(article.sentiment)}`}>
                    {article.sentiment}
                  </span>
                </div>
              </div>
              <p className="mb-3 text-sm opacity-80">Source: {article.source}</p>
              <p className="mb-4">{article.summary}</p>
              <div className="flex flex-wrap gap-2">
                {article.categories.map(category => (
                  <span key={category} className="chip text-xs">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
}
