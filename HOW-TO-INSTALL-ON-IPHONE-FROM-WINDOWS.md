# Getting GuitarCoach From a Windows PC Onto Your iPhone

## The one hard constraint

Xcode — the tool that compiles a SwiftUI/SwiftData app like this one — only
runs on macOS. There is no Windows version, and there's no realistic way
around that for a *native* iOS app: it isn't a missing installer, it's
Apple's own toolchain being Mac-only.

That does **not** mean you need to own a Mac. Plenty of people build and ship
iOS apps from Windows every day, using a Mac that lives in the cloud instead
of on their desk. This document covers the two realistic ways to do that,
plus how to actually get the finished app onto your phone afterward, which is
a separate step people often overlook.

Two decisions shape everything below:

1. **Will you join the Apple Developer Program ($99/year)?** This is
   Apple's paid tier, separate from a free Apple ID. It buys you TestFlight
   (Apple's official app-distribution channel — install and update the app
   like any App Store app, signed for a full year) instead of a workaround
   that needs re-signing every 7 days.
2. **Which cloud build service will compile the project?** Recommended:
   **Codemagic** — it's built specifically for "I don't own a Mac" iOS
   development, has a free tier, and can push straight to TestFlight.

| | Path A: Recommended | Path B: Budget |
|---|---|---|
| Apple account | Developer Program, $99/year | Free Apple ID, $0 |
| Build service | Codemagic (free tier) | Codemagic or GitHub Actions (free) |
| Install method | TestFlight (official app) | Sideloadly (Windows app) |
| App expires? | No, renews with each TestFlight build (90-day rolling window, auto-extended) | Yes — every 7 days, needs re-signing |
| Update process | Push code → Codemagic rebuilds → TestFlight notifies you | Push code → rebuild → re-download .ipa → re-run Sideloadly |
| Best for | Using this daily, long-term, without fiddling | Trying it out before committing $99 |

If you're not sure, Path A is genuinely easier to live with once it's set
up — the 7-day resigning cycle in Path B is a real chore for an app you
open every day. Both are explained in full below; skip to whichever you
picked.

---

## Path A: Codemagic + Apple Developer Program + TestFlight

### Step 1 — Join the Apple Developer Program

Go to [developer.apple.com/programs](https://developer.apple.com/programs/)
and enroll with your Apple ID ($99/year, individual enrollment). Approval is
usually near-instant to a day or two.

### Step 2 — Put the project on GitHub

Codemagic builds from a Git repository, so the code needs a home there
first. On your Windows PC, with [Git for Windows](https://git-scm.com/download/win)
installed (or using GitHub Desktop's GUI if you'd rather not touch a
terminal):

```
cd path\to\GuitarCoach
git init
git add .
git commit -m "Initial commit"
```

Create a new **empty** repository on [github.com](https://github.com/new)
(don't let GitHub add a README — you already have one), then:

```
git remote add origin https://github.com/<your-username>/GuitarCoach.git
git branch -M main
git push -u origin main
```

### Step 3 — Create an App Store Connect API key

This is what lets Codemagic sign builds and upload to TestFlight without
ever touching a Mac yourself.

1. Sign in to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) →
   **Users and Access → Integrations → App Store Connect API**.
2. Click **Generate API Key**, give it a name, role **App Manager**.
3. Download the `.p8` key file **immediately** — App Store Connect only
   lets you download it once. Note the **Key ID** and **Issuer ID** shown
   next to it.
4. Still in App Store Connect, go to **Apps → +** and register a new app:
   platform iOS, a name ("GuitarCoach"), a bundle ID you create under
   **Certificates, Identifiers & Profiles → Identifiers** (something like
   `com.yourname.guitarcoach`), and your primary language. This reserves
   the app's identity; you don't need any screenshots, descriptions, or
   pricing for TestFlight-only distribution.

### Step 4 — Set up Codemagic

1. Sign up at [codemagic.io](https://codemagic.io) with your GitHub
   account and grant it access to the `GuitarCoach` repo.
2. Add a new app in Codemagic, pointing at that repo. Codemagic will detect
   it as an iOS project.
3. Under the app's **Team integrations / Code signing**, add your App
   Store Connect API key: paste in the Key ID, Issuer ID, and upload the
   `.p8` file from Step 3. Codemagic uses this to automatically create and
   manage signing certificates and provisioning profiles — you never
   generate those by hand.
4. In the project's Xcode settings (which Codemagic reads from the repo),
   the bundle identifier in your Xcode project must exactly match the one
   you registered in Step 3. Set it under the `GuitarCoach` target →
   **Signing & Capabilities → Bundle Identifier** before your first commit
   that you want built (you can edit this file directly in the repo on
   GitHub.com if you don't have Xcode to open it in).
5. Configure the workflow (Codemagic's UI walks through this, or add a
   `codemagic.yaml` to the repo root):

```yaml
workflows:
  ios-workflow:
    name: GuitarCoach iOS
    max_build_duration: 60
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: codemagic_api_key   # the name you gave the key in step 4
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.yourname.guitarcoach
      vars:
        XCODE_WORKSPACE: "GuitarCoach.xcodeproj"
        XCODE_SCHEME: "GuitarCoach"
      xcode: latest
    scripts:
      - name: Set up code signing
        script: xcode-project use-profiles
      - name: Build ipa
        script: |
          xcode-project build-ipa \
            --project "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

6. Trigger a build (push a commit, or click "Start new build" in Codemagic).
   The free tier includes 500 build minutes a month, and one iOS build
   typically takes 10-20 minutes — plenty for occasional updates to a
   personal app.

### Step 5 — Install via TestFlight

1. Once the build succeeds and uploads, go to App Store Connect → your app
   → **TestFlight** tab. Add yourself as an internal tester (just your own
   Apple ID email).
2. On your iPhone, install the **TestFlight** app from the App Store.
3. You'll get an email/notification invite — accept it, and TestFlight
   installs GuitarCoach.
4. Every time Codemagic finishes a new build, TestFlight notifies you and
   you tap "Update." No cables, no Windows-side steps at all after this
   point.

---

## Path B: Free Apple ID + a cloud build + Sideloadly

Use this if you'd rather not pay $99/year yet, or just want to try the app
first. You'll rebuild through a cloud service the same way, but export a
plain `.ipa` file instead of publishing to TestFlight, then install it
yourself from Windows using **Sideloadly**.

### Step 1 — Build the .ipa in the cloud

Either:

- **Codemagic**, same setup as Path A steps 2 and 4, but skip the App Store
  Connect API key and TestFlight publishing — just let it produce an
  unsigned or ad-hoc `.ipa` as a build artifact you download directly from
  the Codemagic build page, or
- **GitHub Actions**, using a macOS runner (free for public repos, a
  monthly free quota for private ones): add a workflow file that runs
  `xcodebuild` and uploads the resulting `.ipa` as a build artifact. This
  needs a bit more YAML/Fastlane know-how than Codemagic's guided setup,
  so Codemagic is the easier starting point.

Either way, the actual code signing for this path doesn't need to be
correct yet — Sideloadly re-signs the `.ipa` itself in the next step using
your own Apple ID, so an ad-hoc or even a "generic" development-signed
build works as the input.

### Step 2 — Download the .ipa to your Windows PC

Download the build artifact from Codemagic (or the GitHub Actions run) to
somewhere easy to find, like your Downloads folder.

### Step 3 — Install Sideloadly and sideload the app

1. Download [Sideloadly](https://sideloadly.io/) for Windows and install
   it. It needs [iTunes (or Apple Devices) for Windows](https://apps.microsoft.com/detail/9np83lwlpz9k)
   installed too, so Windows can talk to the iPhone over USB.
2. Plug your iPhone into your Windows PC with a cable and trust the
   computer when prompted on the phone.
3. Open Sideloadly, drag the `.ipa` file into it.
4. Enter your Apple ID email in the field Sideloadly asks for (an
   app-specific password may be required — Sideloadly links to Apple's
   page for generating one if so) and click **Start**.
5. Sideloadly re-signs the app with a free personal-team certificate tied
   to your Apple ID and installs it directly onto your phone.
6. On the iPhone, the first time you open the app you'll likely need to go
   to **Settings → General → VPN & Device Management** and tell it to
   trust your Apple ID as a developer.

### The 7-day catch

Apps signed with a **free** Apple ID (no Developer Program) stop working
after 7 days — this is an Apple limitation on the free tier, not a bug.
Before that week is up:

1. Plug the iPhone back into the Windows PC.
2. Open Sideloadly, drag in the **same** `.ipa` file again, enter your
   Apple ID again, click Start.

That's it — no rebuild needed unless you've actually changed the code. It
takes under a minute. If this gets old, joining the Developer Program later
(Path A) removes it entirely — you don't have to decide up front.

---

## A note on "renting a Mac" instead

Services like MacinCloud let you remote-desktop into a real Mac with Xcode
already installed, for roughly $1/hour or a monthly plan. This is a
perfectly good alternative to Codemagic if you'd rather see the normal
Xcode interface (useful if you plan to keep hand-editing Swift code
yourself rather than just rebuilding what's here). The workflow is the
same either way: build the `.ipa` on that remote Mac, download it to your
Windows PC, then install it with TestFlight (Path A) or Sideloadly (Path B)
exactly as above — you don't need to plug your iPhone into the rented Mac,
since the file transfer happens over your Windows PC.

## Summary

| Step | Path A (recommended) | Path B (budget) |
|---|---|---|
| 1 | Join Apple Developer Program ($99/yr) | Nothing to pay |
| 2 | Push code to GitHub | Push code to GitHub |
| 3 | Codemagic builds + signs + uploads to TestFlight | Codemagic/GitHub Actions builds an .ipa |
| 4 | Install via TestFlight app | Install via Sideloadly (Windows) |
| 5 | Updates arrive automatically | Re-run Sideloadly on every rebuild, and every 7 days regardless |
