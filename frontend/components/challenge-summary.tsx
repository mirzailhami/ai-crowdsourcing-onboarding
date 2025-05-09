"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Users, FileText, Trophy, Calendar, ClipboardCheck, BarChart3 } from "lucide-react"
import { format } from "date-fns"

interface ChallengeSummaryProps {
  onEditStep: (step: number) => void
  formData: any
}

export function ChallengeSummary({ onEditStep, formData }: ChallengeSummaryProps) {
  const step1 = formData.step1 || {}
  const step2 = formData.step2 || {}
  const step3 = formData.step3 || {}
  const step4 = formData.step4 || {}
  const step5 = formData.step5 || {}
  const step6 = formData.step6 || {}
  const step7 = formData.step7 || {}

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Challenge Overview</CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEditStep(1)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">{step1.title || "Untitled Challenge"}</h3>
            <Badge className="mt-2">{step1.challenge_type || "Not Specified"}</Badge>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Problem Statement</h4>
            <p>{step1.problem_statement || "No problem statement provided."}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Goals</h4>
            <p>{step1.goals || "No goals provided."}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            <CardTitle>Audience & Registration</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditStep(2)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Participant Type</h4>
              <p>{step2.participant_type || "Not specified"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Geographic Filter</h4>
              <p>{step2.geographic_filter || "Not specified"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Language</h4>
              <p>{step2.language || "Not specified"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Team Participation</h4>
              <p>{step2.team_participation ? "Allowed" : "Not Allowed"}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Forums & Q&A</h4>
            <p>{step2.enable_forums ? "Enabled" : "Disabled"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            <CardTitle>Submission Requirements</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditStep(3)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Submission Formats</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {(step3.submission_formats || []).map((format: string, index: number) => (
                <Badge key={index} variant="outline">
                  {format}
                </Badge>
              ))}
              {(!step3.submission_formats || step3.submission_formats.length === 0) && (
                <p className="text-sm text-muted-foreground">No formats specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Required Documentation</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {(step3.submission_documentation || []).map((doc: string, index: number) => (
                <Badge key={index} variant="outline">
                  {doc}
                </Badge>
              ))}
              {(!step3.submission_documentation || step3.submission_documentation.length === 0) && (
                <p className="text-sm text-muted-foreground">No documentation specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Instructions</h4>
            <p>{step3.submission_instructions || "No instructions provided."}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            <CardTitle>Prizes</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditStep(4)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Prize Model</h4>
            <p>{step4.prize_model || "Not specified"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Prize Amounts</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm">First Prize</p>
                <p className="font-bold">{step4.first_prize ? `$${step4.first_prize}` : "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm">Second Prize</p>
                <p className="font-bold">{step4.second_prize ? `$${step4.second_prize}` : "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm">Third Prize</p>
                <p className="font-bold">{step4.third_prize ? `$${step4.third_prize}` : "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm">Honorable Mentions</p>
                <p className="font-bold">
                  {step4.honorable_mentions ? `$${step4.honorable_mentions}` : "Not specified"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Total Budget</h4>
            <p className="font-bold">{step4.budget ? `$${step4.budget}` : "Not specified"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Non-Monetary Rewards</h4>
            <p>{step4.non_monetary_rewards || "None specified"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            <CardTitle>Timeline & Milestones</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditStep(5)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Start Date</h4>
              <p>{step5.start_date ? format(new Date(step5.start_date), "PPP") : "Not specified"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">End Date</h4>
              <p>{step5.end_date ? format(new Date(step5.end_date), "PPP") : "Not specified"}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Key Milestones</h4>
            <div className="space-y-2 mt-2">
              {(step5.milestones || []).map((milestone: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span>
                    {milestone.name} {milestone.enabled ? "" : "(Disabled)"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {milestone.date ? format(new Date(milestone.date), "PPP") : "Not specified"}
                  </span>
                </div>
              ))}
              {(!step5.milestones || step5.milestones.length === 0) && (
                <p className="text-sm text-muted-foreground">No milestones specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Timeline Notes</h4>
            <p>{step5.timeline_notes || "None specified"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5" />
            <CardTitle>Review & Evaluation</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditStep(6)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Evaluation Model</h4>
            <p>{step6.evaluation_model || "Not specified"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Reviewer Roles</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {(step6.reviewers || []).map((reviewer: string, index: number) => (
                <Badge key={index} variant="outline">
                  {reviewer}
                </Badge>
              ))}
              {(!step6.reviewers || step6.reviewers.length === 0) && (
                <p className="text-sm text-muted-foreground">No reviewers specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Evaluation Criteria</h4>
            <div className="space-y-2 mt-2">
              {(step6.evaluation_criteria || []).map((criterion: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{criterion.name}</span>
                  <span className="font-semibold">{criterion.weight}</span>
                </div>
              ))}
              {(!step6.evaluation_criteria || step6.evaluation_criteria.length === 0) && (
                <p className="text-sm text-muted-foreground">No criteria specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Anonymized Review</h4>
            <p>{step6.anonymized_review ? "Enabled" : "Disabled"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            <CardTitle>Monitoring</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditStep(7)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Notification Preferences</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {(step7.notification_preferences || []).map((pref: string, index: number) => (
                <Badge key={index} variant="outline">
                  {pref}
                </Badge>
              ))}
              {(!step7.notification_preferences || step7.notification_preferences.length === 0) && (
                <p className="text-sm text-muted-foreground">No preferences specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Notification Methods</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {(step7.notification_methods || []).map((method: string, index: number) => (
                <Badge key={index} variant="outline">
                  {method}
                </Badge>
              ))}
              {(!step7.notification_methods || step7.notification_methods.length === 0) && (
                <p className="text-sm text-muted-foreground">No methods specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Announcement Template</h4>
            <p>{step7.announcement_template || "None specified"}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Monitoring Access</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {(step7.access_level || []).map((access: string, index: number) => (
                <Badge key={index} variant="outline">
                  {access}
                </Badge>
              ))}
              {(!step7.access_level || step7.access_level.length === 0) && (
                <p className="text-sm text-muted-foreground">No access roles specified</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">Success Metrics</h4>
            <p>{step7.success_metrics || "None specified"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
