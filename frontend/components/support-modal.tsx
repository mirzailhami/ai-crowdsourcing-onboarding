"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createHelpRequest } from "@/lib/api"

interface SupportModalProps {
  challengeId: number | null
  onClose: () => void
}

export function SupportModal({ challengeId, onClose }: SupportModalProps) {
  const [supportType, setSupportType] = useState("")
  const [urgency, setUrgency] = useState("medium")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!supportType || !message || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createHelpRequest({
        message,
        support_type: supportType,
        urgency,
        email,
      })
      toast({
        title: "Success",
        description: "Your support request has been submitted.",
      })
      onClose()
    } catch (error) {
      console.error("Error submitting help request:", error)
      toast({
        title: "Error",
        description: "Failed to submit support request.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Support</DialogTitle>
          <DialogDescription>
            Get help from our platform experts for your challenge setup.
            {challengeId && ` (Challenge ID: ${challengeId})`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="support-type">Support Type</Label>
            <Select onValueChange={setSupportType} value={supportType}>
              <SelectTrigger id="support-type">
                <SelectValue placeholder="Select type of support" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Assistance</SelectItem>
                <SelectItem value="strategy">Challenge Strategy</SelectItem>
                <SelectItem value="pricing">Prize & Budget Guidance</SelectItem>
                <SelectItem value="review">Challenge Review</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select onValueChange={setUrgency} value={urgency}>
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High - Need help ASAP</SelectItem>
                <SelectItem value="medium">Medium - Within 24 hours</SelectItem>
                <SelectItem value="low">Low - General guidance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe what you need help with..."
              className="min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
