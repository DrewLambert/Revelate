# UptimeRobot Setup Guide

**Service:** UptimeRobot (Website Uptime Monitoring)
**Cost:** Free tier available (50 monitors) or Pro ($7/month for 20 monitors)
**Account:** [uptimerobot.com](https://uptimerobot.com)

---

## What is UptimeRobot?

UptimeRobot monitors your website's uptime by sending HTTP requests from various IP addresses worldwide. If your site is down, it sends you alerts via email, SMS, Slack, etc.

---

## IP Allowlisting Required

UptimeRobot uses **238 IP addresses** (124 IPv4 + 114 IPv6) to check your website. If your database or services have IP restrictions, you must allowlist these IPs.

**All 238 IPs are documented in:** [docs/uptimerobot-ips.txt](uptimerobot-ips.txt)

---

## Where to Add UptimeRobot IPs

### 1. Neon Database (PostgreSQL) - **CRITICAL**

**Why:** Your database is protected by IP allowlist. UptimeRobot needs to access your site, which queries the database.

**Steps:**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Go to **Settings** → **IP Allow**
4. Click **Add IPs**
5. Paste all 238 IPs from `uptimerobot-ips.txt`
6. Save changes

**Alternative (Easier but Less Secure):**
- Set IP allowlist to `0.0.0.0/0` (allow all IPs)
- This allows connections from anywhere, including UptimeRobot
- ⚠️ Less secure, but common for websites

**Free Tier Limitation:**
- Neon Free Tier may limit the number of IPs you can allowlist
- If you hit the limit, consider:
  - Upgrading to Neon Pro ($19/month) for unlimited IPs
  - Using `0.0.0.0/0` allowlist (allow all)

---

### 2. Vercel (Usually Not Required)

Vercel doesn't typically require IP allowlisting. Your site is publicly accessible by default.

**Only required if:**
- You enabled Vercel Firewall (Enterprise feature)
- You're using custom edge middleware to block IPs

---

### 3. Cloudflare or Other CDN/WAF (If Applicable)

If you're using a CDN or Web Application Firewall in front of Vercel:

**Steps:**
1. Go to your CDN dashboard (Cloudflare, Fastly, etc.)
2. Navigate to Firewall / WAF Rules
3. Create an allowlist rule for UptimeRobot IPs
4. Add all 238 IPs from `uptimerobot-ips.txt`

**Note:** Most Revelate Operations setups don't use a CDN, so this likely doesn't apply.

---

## Setting Up UptimeRobot Monitors

### 1. Create Account
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up for free account

### 2. Add Your First Monitor
1. Click **Add New Monitor**
2. Configure:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Revelate Ops - Homepage
   - **URL:** `https://yoursite.com`
   - **Monitoring Interval:** 5 minutes (free tier)
   - **Monitor Timeout:** 30 seconds
3. Click **Create Monitor**

### 3. Add Additional Monitors (Recommended)
- **Homepage:** `https://yoursite.com`
- **Admin Panel:** `https://yoursite.com/admin`
- **API Health Check:** `https://yoursite.com/api/health` (if you create one)
- **Database Connection:** Monitor admin API to ensure DB is accessible

### 4. Set Up Alerts
1. Go to **My Settings** → **Alert Contacts**
2. Add your email, Slack webhook, or phone number
3. Configure when to receive alerts:
   - Down immediately (recommended)
   - Down for 2+ minutes (reduces false positives)

---

## UptimeRobot IP List Management

### IP List Location
**File:** [docs/uptimerobot-ips.txt](uptimerobot-ips.txt)

**Format:**
- Line-by-line (one IP per line)
- 124 IPv4 addresses
- 114 IPv6 addresses

### Keeping IPs Updated

UptimeRobot occasionally adds new monitoring locations (new IPs).

**Official IP List:**
[https://uptimerobot.com/inc/files/ips/IPv4andIPv6.txt](https://uptimerobot.com/inc/files/ips/IPv4andIPv6.txt)

**Recommended Update Schedule:**
- Check quarterly (every 3 months)
- Compare official list to `uptimerobot-ips.txt`
- Update Neon allowlist if changes detected

**How to Check for Updates:**
```bash
curl https://uptimerobot.com/inc/files/ips/IPv4andIPv6.txt > uptimerobot-ips-latest.txt
diff uptimerobot-ips.txt uptimerobot-ips-latest.txt
```

---

## Copy-Paste Formats

### One IP Per Line (Default)
```
3.12.251.153
3.20.63.178
3.77.67.4
```
*Already formatted in `uptimerobot-ips.txt`*

### Comma-Separated (CSV)
```
3.12.251.153,3.20.63.178,3.77.67.4,3.79.134.69
```

### CIDR Notation (If Required)
```
3.12.251.153/32
3.20.63.178/32
3.77.67.4/32
```

### PostgreSQL `pg_hba.conf` Format
```
host    all    all    3.12.251.153/32    md5
host    all    all    3.20.63.178/32     md5
```

---

## Troubleshooting

### Problem: UptimeRobot reports site is down, but it's working
**Cause:** Database is blocking UptimeRobot IPs

**Solution:**
1. Check Neon IP allowlist includes all UptimeRobot IPs
2. Verify no firewall rules are blocking the IPs
3. Test by temporarily setting Neon allowlist to `0.0.0.0/0`

---

### Problem: Neon won't accept 238 IPs (free tier limit)
**Solutions:**
1. **Upgrade to Neon Pro** ($19/month) for unlimited IP allowlist
2. **Use 0.0.0.0/0 allowlist** (allow all IPs - less secure)
3. **Monitor only Vercel endpoints** that don't hit the database
4. **Use a different monitoring service** with fewer IPs

---

### Problem: Too many false positive alerts
**Solutions:**
1. Increase monitoring interval (5 min → 10 min)
2. Set alert threshold to "down for 2+ minutes" instead of immediate
3. Exclude monitors during known maintenance windows
4. Check if database is auto-pausing (Neon free tier)

---

## Cost Summary

| Plan | Price | Monitors | Interval |
|------|-------|----------|----------|
| **Free** | $0 | 50 | 5 minutes |
| **Pro** | $7/month | 20 | 1 minute |
| **Business** | $18/month | 50 | 1 minute |

**Recommendation for Revelate Operations:**
- Start with **Free tier** (50 monitors is plenty)
- Upgrade to Pro only if you need:
  - 1-minute monitoring intervals
  - Advanced alert routing
  - Status pages

---

## Integration with Slack (Optional)

### Set Up Slack Alerts
1. Create Slack incoming webhook:
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Create app → Incoming Webhooks → Activate
   - Add webhook to desired channel
   - Copy webhook URL

2. Add to UptimeRobot:
   - Go to **My Settings** → **Alert Contacts**
   - Click **Add Alert Contact**
   - Type: **Webhook**
   - URL: Paste your Slack webhook URL
   - Click **Create Alert Contact**

3. Assign to monitors:
   - Edit each monitor
   - Select the Slack alert contact
   - Save

**Result:** Receive downtime alerts directly in Slack

---

## Summary Checklist

- [ ] Sign up for UptimeRobot account
- [ ] Add all 238 IPs to Neon database allowlist (or use 0.0.0.0/0)
- [ ] Create monitor for homepage
- [ ] Create monitor for admin panel
- [ ] Create monitor for API endpoints (if applicable)
- [ ] Set up email alerts
- [ ] (Optional) Set up Slack webhook alerts
- [ ] Test monitors by temporarily breaking your site
- [ ] Set calendar reminder to check for IP updates quarterly

---

**Last Updated:** November 7, 2025
**IP List Version:** 238 IPs (124 IPv4, 114 IPv6)
**Next Review:** February 7, 2026
