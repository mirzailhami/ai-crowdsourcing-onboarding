"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Send, Loader2, User, Trash2, Bot, RefreshCw, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { fetchCopilot, type CopilotRequest } from "@/lib/api"
import { useLocalStorage } from "@/lib/local-storage"
import { toast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface Message {
  role: "user" | "assistant" | "error"
  content: string
  timestamp: string
  isRetryable?: boolean
  createdAt: Date
  suggestions?: string[]
}

interface AIAssistantProps {
  currentStep: number
  formData: {
    challenge_type?: string
    title?: string
    problem_statement?: string
    goals?: string
    target_audience?: string
    enable_forums?: boolean
    geographic_filters?: string
    participant_skills?: string
    diversity_goals?: string
    submission_formats?: string
    required_docs?: string
    instructions?: string
    allow_video_submissions?: boolean
    prize_structure?: string
    non_monetary_rewards?: string
    budget?: number
    tiered_prizes?: boolean
    sponsorship_ideas?: string
    milestones?: string
    timeline?: string
    key_dates?: string
    submission_deadline?: string
    buffer_time?: string
    evaluation_criteria?: string
    anonymous_judging?: boolean
    number_of_judges?: number
    scoring_rubrics?: string
    tie_handling?: string
    key_metrics?: string
    success_measures?: string
    notification_settings?: string
    dispute_handling?: string
    update_frequency?: string
  }
  currentFormValues: {
    challenge_type?: string
    title?: string
    problem_statement?: string
    goals?: string
    participant_type?: string
    geographic_filter?: string
    language?: string
    submission_formats?: string[]
    submission_documentation?: string[]
    submission_instructions?: string
    prize_model?: string
    budget?: number
    start_date?: string | Date
    end_date?: string | Date
    evaluation_model?: string
    reviewers?: string[]
    evaluation_criteria?: string[]
    notification_preferences?: string[]
    notification_methods?: string[]
    access_level?: string[]
  }
  onRequestSupport: () => void
}

const suggestionsByStep: { [key: number]: string[] } = {
  1: [
    "Good problem statement?",
    "Challenge type suggestions",
    "Define clear goals",
    "Example challenges",
    "Scope my challenge",
  ],
  2: ["Target audience?", "Enable forums?", "Geographic filters?", "Participant skills", "Attract diversity"],
  3: ["Submission formats", "Required docs", "Clear instructions", "Example requirements", "Video submissions?"],
  4: ["Prize structure", "Non-monetary rewards", "Set budget", "Tiered prizes?", "Sponsorship ideas"],
  5: ["Milestones", "Timeline suggestions", "Key dates", "Submission time", "Buffer time"],
  6: ["Evaluation criteria", "Anonymous judging?", "Number of judges", "Scoring rubrics", "Handle ties"],
  7: ["Key metrics", "Measure success", "Notifications", "Handle disputes", "Send updates"],
}

export function AIAssistant({ currentStep, formData, currentFormValues, onRequestSupport }: AIAssistantProps) {
  const [messages, setMessages] = useLocalStorage<Message[]>(`crowdlaunch:chat-step${currentStep}`, [
    {
      role: "assistant",
      content: "Hi, I'm your AI Copilot! How can I assist you in defining your challenge?",
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useLocalStorage<boolean>(
    `crowdlaunch:suggestions-step${currentStep}`,
    true,
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestionsScrollRef = useRef<HTMLDivElement>(null)
  const isSuggestionDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const formatTimeAgo = (date: Date) => {
    const distance = formatDistanceToNow(date, { addSuffix: true })
    return distance
      .replace("about ", "")
      .replace("less than a minute ago", "just now")
      .replace(" minute ago", " min ago")
      .replace(" minutes ago", " mins ago")
      .replace(" hour ago", " hr ago")
      .replace(" hours ago", " hrs ago")
  }

  const fetchResponse = useCallback(
    async (userInput: string) => {
      setIsLoading(true);
      try {
        // Define step-specific form data fields using currentFormValues
        const stepFormData: { [key: number]: { [key: string]: any } } = {
          1: {
            challenge_type: currentFormValues.challenge_type || formData.challenge_type,
            title: currentFormValues.title || formData.title,
            problem_statement: currentFormValues.problem_statement || formData.problem_statement,
            goals: currentFormValues.goals || formData.goals,
          },
          2: {
            participant_type: currentFormValues.participant_type || formData.target_audience,
            enable_forums: formData.enable_forums,
            geographic_filter: currentFormValues.geographic_filter || formData.geographic_filters,
            language: currentFormValues.language || formData.participant_skills,
            team_participation: formData.team_participation || false,
          },
          3: {
            submission_formats: currentFormValues.submission_formats || formData.submission_formats,
            submission_documentation: currentFormValues.submission_documentation || formData.required_docs,
            submission_instructions: currentFormValues.submission_instructions || formData.instructions,
          },
          4: {
            prize_model: currentFormValues.prize_model || formData.prize_structure,
            non_monetary_rewards: formData.non_monetary_rewards,
            budget: currentFormValues.budget || formData.budget,
            first_prize: currentFormValues.first_prize || formData.first_prize,
            second_prize: currentFormValues.second_prize || formData.second_prize,
            third_prize: currentFormValues.third_prize || formData.third_prize,
            honorable_mentions: currentFormValues.honorable_mentions || formData.honorable_mentions,
          },
          5: {
            start_date: currentFormValues.start_date || formData.start_date,
            end_date: currentFormValues.end_date || formData.submission_deadline,
            milestones: formData.milestones,
            timeline_notes: formData.timeline,
          },
          6: {
            evaluation_model: currentFormValues.evaluation_model || formData.evaluation_model || 'post',
            reviewers: currentFormValues.reviewers || formData.reviewers || [],
            evaluation_criteria: currentFormValues.evaluation_criteria || formData.evaluation_criteria,
            anonymized_review: formData.anonymous_judging,
          },
          7: {
            notification_preferences: currentFormValues.notification_preferences || formData.notification_settings,
            notification_methods: currentFormValues.notification_methods || formData.notification_methods || [],
            announcement_template: currentFormValues.announcement_template || formData.announcement_template || '',
            access_level: currentFormValues.access_level || formData.access_level || [],
            success_metrics: formData.success_measures,
          },
        };

        // Aggregate form data from step 1 up to the current step
        const relevantFormData: { [key: string]: any } = {};
        for (let step = 1; step <= currentStep; step++) {
          if (stepFormData[step]) {
            Object.assign(relevantFormData, stepFormData[step]);
          }
        }

        const payload: CopilotRequest = {
          messages: [...messages.filter((msg) => msg.role !== "error"), { role: "user", content: userInput }],
          context: messages.filter((msg) => msg.role === "assistant" || msg.role === "user").map((msg) => msg.content),
          formData: relevantFormData,
          step: currentStep,
        };
        console.log("Sending payload to fetchCopilot:", payload);

        const response = await fetchCopilot(payload);
        const assistantMessage: Message = {
          role: "assistant",
          content: response.content,
          timestamp: new Date().toISOString(),
          createdAt: new Date(),
          suggestions: response.suggestions || [],
        };
        setMessages((prev) => [
          ...prev,
          { role: "user", content: userInput, timestamp: new Date().toISOString(), createdAt: new Date() },
          assistantMessage,
        ]);
      } catch (error: any) {
        const errorMessage: Message = {
          role: "error",
          content: `Error: ${error.message}. Click to retry.`,
          isRetryable: error.code === "ECONNABORTED",
          timestamp: new Date().toISOString(),
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast({
          title: "Error",
          description: "Failed to get AI response. Retry or request human support.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentStep, messages, setMessages, formData, currentFormValues],
  );

  const handleSend = async () => {
    if (!input.trim()) return
    await fetchResponse(input)
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleSuggestion = async (suggestion: string) => {
    // Don't handle suggestion clicks when dragging
    if (isSuggestionDragging.current) return
    await fetchResponse(suggestion)
  }

  const handleRetry = async (content: string) => {
    const userInput = content.replace("Error: ", "").replace(". Click to retry.", "")
    await fetchResponse(userInput)
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi, I'm your AI Copilot! How can I assist you in defining your challenge?",
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
      },
    ])
  }

  const toggleSuggestions = () => {
    setShowSuggestions((prev) => !prev)
  }

  const shuffleArray = (array: string[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize without showing scrollbar
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`
    e.target.style.overflowY = "hidden"
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Improved suggestion scrolling with simpler and more robust approach
  const scrollSuggestions = (direction: 'left' | 'right') => {
    if (!suggestionsScrollRef.current) return;

    const scrollAmount = 200; // Adjust scroll amount as needed
    const currentScroll = suggestionsScrollRef.current.scrollLeft;

    if (direction === 'left') {
      suggestionsScrollRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      suggestionsScrollRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  // Simple wheel event handler for horizontal scrolling
  const handleSuggestionWheel = (e: React.WheelEvent) => {
    if (!suggestionsScrollRef.current) return;

    // Prevent default to avoid page scroll
    e.preventDefault();

    // Use deltaY for horizontal scrolling
    suggestionsScrollRef.current.scrollLeft += e.deltaY;
  }

  // Mouse drag scrolling (simplified implementation)
  const handleSuggestionMouseDown = (e: React.MouseEvent) => {
    if (!suggestionsScrollRef.current) return;

    isSuggestionDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = suggestionsScrollRef.current.scrollLeft;

    // Apply styling
    document.body.style.userSelect = 'none';
    suggestionsScrollRef.current.style.cursor = 'grabbing';
  }

  const handleSuggestionMouseMove = (e: React.MouseEvent) => {
    if (!isSuggestionDragging.current || !suggestionsScrollRef.current) return;

    const dx = e.clientX - startX.current;
    suggestionsScrollRef.current.scrollLeft = scrollLeft.current - dx;
  }

  const handleSuggestionMouseUp = () => {
    isSuggestionDragging.current = false;

    // Reset styling
    document.body.style.userSelect = '';
    if (suggestionsScrollRef.current) {
      suggestionsScrollRef.current.style.cursor = 'grab';
    }

    // Add a small delay before allowing clicks to prevent accidental suggestions selection
    setTimeout(() => {
      isSuggestionDragging.current = false;
    }, 50);
  }

  const handleSuggestionMouseLeave = handleSuggestionMouseUp;

  useEffect(() => {
    const stepSuggestions = suggestionsByStep[currentStep] || []
    setSuggestions(shuffleArray(stepSuggestions).slice(0, 5))
  }, [currentStep])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Custom components for ReactMarkdown to apply Tailwind classes
  const markdownComponents = {
    p: ({ node, ...props }) => <p className="text-sm text-gray-800 mb-2" {...props} />,
    h1: ({ node, ...props }) => <h1 className="text-xl font-semibold text-gray-800 mb-2" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-gray-800 mb-2" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-md font-semibold text-gray-800 mb-2" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside text-sm text-gray-800 mb-2" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-sm text-gray-800 mb-2" {...props} />,
    li: ({ node, ...props }) => <li className="text-sm text-gray-800" {...props} />,
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      <Card className="w-full h-[600px] flex flex-col bg-background shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
        <CardHeader className="p-4 border-b flex flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-blue-100">
              <AvatarFallback className="bg-blue-600 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">AI Copilot</h3>
              <p className="text-xs text-gray-500">
                Step {currentStep} • {messages.length} messages
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSuggestions}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label={showSuggestions ? "Hide suggestions" : "Show suggestions"}
            >
              {showSuggestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group relative`}
              >
                {msg.role === "error" ? (
                  <div className="max-w-[85%] rounded-lg p-4 bg-red-50 border border-red-200 shadow-sm flex items-center gap-3">
                    <div className="flex-1 text-red-700 text-sm">
                      {msg.content.replace("Error: ", "").replace(". Click to retry.", "")}
                    </div>
                    {msg.isRetryable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(msg.content)}
                        className="text-red-700 border-red-300 hover:bg-red-100 h-8"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-full ${msg.role === "user"
                      ? "rounded-xl px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-md"
                      : ""
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      {msg.role === "assistant" ? (
                        <div className="text-gray-800 leading-relaxed">
                          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
                            {msg.content}
                          </ReactMarkdown>
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Suggestions:</h4>
                              <ul className="space-y-2 mb-2">
                                {msg.suggestions.map((suggestion, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={() => handleSuggestion(suggestion)}
                                  >
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      <p className="text-xs flex items-center gap-1 opacity-50">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(new Date(msg.timestamp))}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl p-4 bg-gray-100 flex items-center gap-3 shadow-sm border border-gray-100">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-0 border-t flex flex-col overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-2xl">
          {showSuggestions && suggestions.length > 0 && (
            <div className="px-2 py-2 border-b relative">
              <div className="flex items-center">
                <div
                  ref={suggestionsScrollRef}
                  className="overflow-hidden scrollbar-hide cursor-grab active:cursor-grabbing flex-1 mx-1"
                  onMouseDown={handleSuggestionMouseDown}
                  onMouseMove={handleSuggestionMouseMove}
                  onMouseUp={handleSuggestionMouseUp}
                  onMouseLeave={handleSuggestionMouseLeave}
                  onWheel={handleSuggestionWheel}
                >
                  <div className="flex gap-2 w-max">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestion(suggestion)}
                        disabled={isLoading}
                        className="flex-shrink-0 rounded-full h-8 text-xs font-medium px-4 whitespace-nowrap 
                          border-gray-300 bg-white hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none" />
            </div>
          )}

          <div className="p-4 relative w-full">
            <div className="relative shadow-sm rounded-full border-gray-300 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-300 text-gray-800">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask the AI anything..."
                className="w-full pr-12 background-none min-h-[48px] max-h-[150px] resize-none placeholder-gray-400 
                  overflow-hidden"
                disabled={isLoading}
                rows={1}
                style={{ overflowY: 'hidden' }}
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bottom-2 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 
                  text-white transition-colors shadow-md"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-3 text-center">
              <Button
                variant="link"
                size="sm"
                onClick={onRequestSupport}
                disabled={isLoading}
                className="text-gray-500 hover:text-blue-600 transition-colors h-8 text-xs"
              >
                Need human help?
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}