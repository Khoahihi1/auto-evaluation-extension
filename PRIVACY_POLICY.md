# Privacy Policy - Auto Evaluation Extension

**Last Updated**: January 4, 2026

## Overview
Auto Evaluation Extension ("the Extension") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our Extension.

## Information Collection
**We DO NOT collect any personal information.**

The Extension:
- ✅ Does NOT collect personal data
- ✅ Does NOT track user behavior
- ✅ Does NOT send data to external servers
- ✅ Does NOT use analytics
- ✅ Does NOT use cookies

## Data Storage
All data is stored locally on your device using Chrome's built-in storage API:
- Extension state (on/off status)
- Current progress index
- Process counters (processed, skipped, errors)
- Activity logs (stored locally for debugging)

**This data**:
- Remains on YOUR computer only
- Is NOT transmitted anywhere
- Can be cleared by resetting the extension or removing it

## Permissions Used
The Extension requests the following permissions:

### `storage`
- **Purpose**: Save extension state and logs locally
- **Scope**: Local storage only, no sync

### `content_scripts` - Running on all pages
- **Purpose**: Automatically detect and fill evaluation forms
- **Why**: The extension needs to detect when you're on an evaluation page to function properly
- **What it does**: 
  - Detects form fields
  - Auto-fills evaluation responses
  - Clicks navigation buttons
- **What it does NOT do**:
  - Read sensitive information
  - Modify other page content
  - Send data anywhere

## Third-Party Services
We do NOT use any third-party services, analytics, or tracking tools.

## Data Security
Since we don't collect data, there's no data to secure or breach. All processing happens locally on your device.

## Children's Privacy
This Extension does not knowingly collect information from children under 13.

## Your Rights
You can:
- View all stored data via Chrome DevTools
- Clear all data by clicking "Reset" in the extension popup
- Remove all data by uninstalling the extension

## Changes to This Policy
We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.

## Contact
If you have questions about this Privacy Policy, please contact:
- Email: [YOUR_EMAIL]
- GitHub: [YOUR_GITHUB_REPO]

---

**Summary in Vietnamese / Tóm tắt bằng Tiếng Việt:**

Extension này KHÔNG thu thập bất kỳ dữ liệu cá nhân nào. Mọi dữ liệu chỉ được lưu trên máy tính của bạn và KHÔNG được gửi đi đâu cả. Extension chỉ tự động điền form đánh giá và lưu trạng thái để tiếp tục công việc.
