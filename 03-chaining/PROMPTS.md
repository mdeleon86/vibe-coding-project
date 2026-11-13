# PROMPTS.md: Living Prompt Pack

> Module 3 · Prompt Chaining. Re-architect the build with prompt chains; capture the reusable ones here.

## How to use this pack

_Each prompt is a reusable step. Chain them: the output of one becomes the input to the next._

## Prompt chain: Signal Dashboard Validation and Usability Chain

### Step 1: Expand: add the two missing screens
```
Build the next phase of this app in a strict sequence:
1. Add a screen "Churn Detail Screen". Match the layout and spacing of the attached Mixpanel analytics dashboard: https://mixpanel.com screenshot.
2. Add a screen "Recommended Actions Screen". Match the data density of the attached Linear issue detail interface: https://linear.app screenshot.
3. Navigation: write the logic so Churn Detail Screen links to Recommended Actions Screen.

Build these in order so Churn Detail Screen is the anchor for Recommended Actions Screen.
```

### Step 2: Behavior: handle loading, empty and error states
```
Apply the following logic constraints to the Churn Detail Screen flow:
- Use skeleton screens for the Customer churn breakdown by subscription plan (Starter, Pro, Enterprise), showing churn rate, affected accounts, and comparison against the typical churn rate. loading state.
- If no data is present, show the empty state: "No churn data is available for this period. Try selecting a different date range.".
- On fetch failure, trigger the error state: "We couldn't load the churn data. Please try again. Your dashboard data has not been changed.".

Maintain the same design language throughout and tether all behavior strictly to these rules.
```

### Step 3: Refine: polish one thing on one screen
```
The Recommended Actions Screen needs a professional Premium SaaS interface, minimalist layout, strong typography, generous whitespace, subtle shadows, crisp data visualization, and clear visual hierarchy. Professional and polished without unnecessary decoration. polish.
1. Start by listing the 3 biggest gaps in typography and spacing compared to Linear issue detail interface: https://linear.app. Reference its typography, spacing, clean layout, and structured information hierarchy..
2. Once you've identified those, resize the headers and update the The primary recommended action card. Make the recommended action visually dominant, with clearly distinguishable supporting details for the responsible owner, timeline, and success measure. to match.

Don't change anything else in the project or touch the underlying logic.
```

## Reusable techniques learned

- Breaking complex development tasks into EXPAND, BEHAVIOR, and REFINE prompts made changes easier to manage.
- Specifying exact files and components helped prevent unintended changes to other versions.
- Using consistent design specifications, colors, and data definitions helped maintain visual and analytical consistency.
- Testing each change before proceeding helped identify layout and calculation issues.
- Refining one component at a time reduced unnecessary redesigns and preserved existing functionality.

## What broke (and the fix)

_Where a single mega-prompt failed and chaining fixed it._

During development, broad prompts sometimes produced unintended layout changes and inconsistencies between dashboard components.

Breaking the work into smaller, focused prompts helped isolate problems. Specifying the exact file, component, expected behavior, and elements that must remain unchanged made revisions more controlled.

The churn visualization also required multiple refinements to improve spacing, clarify percentage-point calculations, and maintain consistent plan colors. Iterative testing and targeted adjustments helped address these issues without redesigning the entire dashboard.
