# SchoolSync / SchoolMate – Core Architecture, Product Vision & Implementation Plan

_Last updated: 2025-06-03_

---

## 1. Product Vision

SchoolSync (demo: "Mate") is designed to take the pain out of school admin for parents by turning school emails into actionable reminders, events, and notifications—automatically, securely, and with minimal noise or manual sorting.

**Key promise:**  
"No more missed events, forgotten forms, or buried school comms—everything you need in one place, powered by smart automation and privacy-first design."

---

## 2. Core User Flows

### Onboarding
- Collect child(ren)'s names/nicknames, school name(s), teacher names/emails, class/grade.
- Let user choose:
  - Connect a dedicated Gmail for school (recommended, e.g. lachiesaiemail)
  - OR use their main Gmail, with instructions to create a label (e.g., "schoolmate") and filter all school emails into it.

### Gmail Integration
- Via OAuth, request permission to read either:
  - All Inbox emails (dedicated account, no label needed) **OR**
  - Only emails from the specified label (main account, privacy-focused)
- **Personalized filters** (from onboarding) used to maximize relevance, minimize noise.

### Email Parsing Pipeline
1. **Fetch emails** from Gmail (Inbox or Label).
2. **Pre-filter** using "from" and "subject" keywords constructed from onboarding data (see section 5).
3. **AI extraction:** Pass filtered emails to OpenAI (with a focused prompt) to extract actionable info:
   - Look for child-specific, class-specific, or actionable content.
   - Categorize (reminder, event, health, etc.), tag urgency, assign confidence score.
4. **Store structured data** (reminders, events, tasks) in Firestore by user.

### UI/UX
- Dashboard shows actionable items (reminders, events, tasks).
- "Missed something?" button lets parents flag if SchoolSync missed an important message.
- Onboarding wizard guides users through the right setup for their needs.
- Privacy and filtering design clearly explained.

---

## 3. Smart Filtering and Adaptive Learning

### Pre-filtering (using onboarding data)
- Filters constructed from:
  - Child names/nicknames
  - Teacher names/emails
  - Class/grade
  - School name(s)
- Gmail search example:
  ```
  from:(school.edu OR teacher1@school.edu OR principal@school.edu)
  OR subject:("Lachie" OR "Lachlan" OR "Ms Smith" OR "Year 2 Blue" OR homework OR assignment OR field trip OR permission slip OR report card OR conference OR reminder)
  ```

### AI Agent ("School Email Parser")
- Prompt example:
  ```
  "You are a school email assistant for a parent. Extract only actionable information relating to the following child(ren): {child names}, teacher(s): {teacher names}, class: {class/grade}, school: {school name}. Each email may include events, reminders, permission slips, or health alerts. Ignore unrelated content, general newsletters, or marketing."
  ```
- Assigns:
  - Category (event, reminder, health, etc.)
  - Urgency
  - Confidence score (filter out low-confidence items)
- **User feedback loop:**  
  If a parent flags a missed item, save the correction for future prompt finetuning or additional rules.

---

## 4. Privacy & Trust

- **Dedicated Gmail**: Reads only from a school-specific account.
- **Main Gmail**: Reads only from the user-specified label—never accesses personal emails outside that label.
- All data stored securely in Firebase, never sold/shared.
- Clear privacy messaging in onboarding and privacy policy.

---

## 5. Sample Onboarding-Driven Filter Construction

```json
{
  "from": [
    "school.edu",
    "teacher1@school.edu",
    "principal@school.edu"
  ],
  "subject": [
    "Lachie",
    "Lachlan",
    "Ms Smith",
    "Year 2 Blue",
    "homework",
    "assignment",
    "field trip",
    "permission slip",
    "report card",
    "conference",
    "reminder"
  ]
}
```

---

## 6. Implementation Plan

**Phase 1: Email Pipeline MVP**
- Implement Gmail OAuth for dedicated and label-based flows.
- Build onboarding-driven filter construction.
- Fetch emails, filter, and push through AI parser.
- Save structured results to Firestore.

**Phase 2: UI/UX MVP**
- Onboarding wizard (collect child, teacher, school info; guide Gmail connection).
- Simple dashboard for reminders/events/tasks.
- "Missed something?" feedback mechanism.

**Phase 3: Feedback & Learning**
- Log missed items/corrections.
- Regularly review and update AI prompt and filter logic.

---

## 7. What Makes SchoolSync Different?

- **Actionable, personalized reminders**—not just a copy of your inbox.
- **Privacy-first:** Never reads emails outside your school label or account.
- **Adaptive:** Learns from your feedback—gets smarter over time.
- **No spam, no noise, no hidden data scraping.**

---

## 8. Next Steps

- [ ] Build/finish backend Gmail integration (OAuth, label logic, fetch, filter)
- [ ] Finalize onboarding data collection and filter builder
- [ ] Implement AI agent with focused prompt
- [ ] Basic UI for onboarding and dashboard
- [ ] Add feedback loop for missed items

---

**This document is your single source of truth.  
Update it as you go—every decision, filter change, or UI/UX tweak should be reflected here.**
