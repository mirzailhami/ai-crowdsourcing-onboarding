import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lightbulb, Users, FileText, Trophy, Calendar, ClipboardCheck, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Lightbulb className="h-6 w-6" />
            <span>CrowdLaunch</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#platforms" className="text-sm font-medium hover:underline underline-offset-4">
              Platforms
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Launch Your Innovation Challenge with Confidence
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our AI-powered assistant guides you through every step of creating and managing successful
                  crowdsourced innovation challenges.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/onboarding">
                  <Button className="px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" className="px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to create, launch, and monitor successful innovation challenges
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI-Guided Setup</h3>
                <p className="text-center text-muted-foreground">
                  Intelligent assistance at every step with best practices and recommendations
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Step-by-Step Process</h3>
                <p className="text-center text-muted-foreground">
                  Structured workflow from problem definition to challenge monitoring
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dynamic Adaptation</h3>
                <p className="text-center text-muted-foreground">
                  Seamless updates as you refine your challenge parameters and goals
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform guides you through seven essential steps to launch your innovation challenge
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    <h3 className="text-xl font-bold">Define Your Challenge</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Articulate your problem statement, specify goals, and select the appropriate challenge type
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    <h3 className="text-xl font-bold">Set Your Audience & Registration</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Configure participant types, geographic filters, team rules, and communication channels
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    <h3 className="text-xl font-bold">Specify Submission Requirements</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Define formats, documentation needs, templates, and submission rules
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  4
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    <h3 className="text-xl font-bold">Configure Prizes</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Select prize models, get AI-assisted prize recommendations, and manage your budget
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  5
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    <h3 className="text-xl font-bold">Set Your Timeline & Milestones</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Define dates, set intermediate milestones, and validate your schedule
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  6
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ClipboardCheck className="mr-2 h-5 w-5" />
                    <h3 className="text-xl font-bold">Establish Review & Evaluation Criteria</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Select evaluation models, assign reviewers, and configure scoring methods
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  7
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    <h3 className="text-xl font-bold">Monitor Your Challenge</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Set up announcements, alerts, and track progress throughout your challenge
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="px-8">
                  Start Your Challenge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="platforms" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Supported Platforms</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our tool incorporates best practices from leading crowdsourcing platforms
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 py-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-20 w-40 rounded-lg bg-background flex items-center justify-center font-bold text-xl">
                    Topcoder
                  </div>
                  <span className="text-sm text-muted-foreground">Development & Design</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-20 w-40 rounded-lg bg-background flex items-center justify-center font-bold text-xl">
                    Wazoku
                  </div>
                  <span className="text-sm text-muted-foreground">Innovation Management</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-20 w-40 rounded-lg bg-background flex items-center justify-center font-bold text-xl">
                    Kaggle
                  </div>
                  <span className="text-sm text-muted-foreground">Data Science & AI</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-20 w-40 rounded-lg bg-background flex items-center justify-center font-bold text-xl">
                    HeroX
                  </div>
                  <span className="text-sm text-muted-foreground">Prize Challenges</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Launch Your Challenge?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered assistant is ready to guide you through every step of the process
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Link href="/onboarding">
                  <Button size="lg" className="w-full">
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-6 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              <span className="font-semibold">CrowdLaunch</span>
            </div>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-sm hover:underline underline-offset-4">
                Terms
              </Link>
              <Link href="#" className="text-sm hover:underline underline-offset-4">
                Privacy
              </Link>
              <Link href="#" className="text-sm hover:underline underline-offset-4">
                Contact
              </Link>
            </nav>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CrowdLaunch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
