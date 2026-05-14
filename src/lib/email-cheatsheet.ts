// Renovation Cost Cheatsheet — the welcome email sent on subscribe.
// Content uses the same tier ranges + permits the cost calculator uses.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://domustack.com";

export type CheatsheetEmail = { subject: string; html: string; text: string };

export function buildCheatsheetEmail(): CheatsheetEmail {
  const subject = "Your Renovation Cost Cheatsheet (kitchen, bath, roofing & more)";

  const text = [
    "Hi there,",
    "",
    "Thanks for grabbing the Domustack Renovation Cost Cheatsheet. Here are the national averages — adjusted for region — based on 50,000+ projects.",
    "",
    "KITCHEN REMODEL",
    "  Basic    $15K – $30K",
    "  Mid      $30K – $75K   (most popular)",
    "  Premium  $75K – $150K",
    "  Timeline: 4 – 16 weeks",
    "  Permits: building, plumbing, electrical (and gas if range relocates)",
    "",
    "BATHROOM REMODEL",
    "  Basic    $5K – $15K",
    "  Mid      $15K – $35K   (most popular)",
    "  Premium  $35K – $80K",
    "  Timeline: 2 – 8 weeks",
    "  Permits: building, plumbing, electrical, mechanical (vent fan)",
    "",
    "ROOFING",
    "  Basic    $5K – $15K   (3-tab asphalt)",
    "  Mid      $10K – $25K  (architectural shingles)",
    "  Premium  $25K – $80K  (metal / slate / tile)",
    "  Timeline: 1 – 4 weeks",
    "  Permits: building (re-roof) + wind/HOA where applicable",
    "",
    "PAINTING",
    "  Basic    $1.5K – $5K",
    "  Mid      $4K – $12K",
    "  Premium  $10K – $30K  (full skim + designer paint)",
    "  Timeline: 1 – 4 weeks",
    "  Permits: usually none (lead-safe RRP for pre-1978 homes)",
    "",
    "REGION ADJUSTMENT (multiply the base by your region):",
    "  Northeast  +25–30%",
    "  West Coast +30–35%",
    "  South      -5%",
    "  Midwest    -10%",
    "",
    "5 QUESTIONS TO ASK ANY CONTRACTOR BEFORE HIRING:",
    "  1) Are you licensed in this state? (verify directly)",
    "  2) Can I see your liability insurance certificate?",
    "  3) What's your written warranty?",
    "  4) Who pulls the permits — you or me?",
    "  5) What's the change-order process and pricing?",
    "",
    "Want a regional estimate for your project? Try our calculator:",
    SITE_URL + "/cost-calculator",
    "",
    "Or get matched with up to 4 verified contractors in 24 hours:",
    SITE_URL + "/",
    "",
    "Free, no obligation, no per-lead fees baked into your quotes.",
    "",
    "— The Domustack team",
    "Purple Heart Pros LLC · mail@purpleheartpros.com",
    "",
    "If you didn't request this, you can ignore this email. To unsubscribe, reply UNSUBSCRIBE.",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f7f8fa;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1f2e">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #dfe4ec;border-radius:14px;overflow:hidden;margin-top:24px;margin-bottom:24px">
    <div style="background:#0f2940;color:#fff;padding:24px 28px">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#a8c0a4;font-weight:700;margin-bottom:6px">Renovation Cost Cheatsheet</div>
      <div style="font-size:22px;font-weight:700;line-height:1.2">National pricing · adjusted by region</div>
    </div>

    <div style="padding:26px 28px">
      <p style="font-size:15px;line-height:1.55;margin:0 0 14px">
        Hi there — thanks for grabbing the cheatsheet. Below are the cost ranges from
        <strong>50,000+ completed projects</strong> across the US. Use them as a sanity check before you collect quotes.
      </p>

      ${section("Kitchen Remodel", "🍳", [
        ["Basic", "$15K – $30K"],
        ["Mid-range (most popular)", "$30K – $75K"],
        ["Premium", "$75K – $150K"],
      ], "4 – 16 weeks · Permits: building, plumbing, electrical (and gas if range relocates)")}

      ${section("Bathroom Remodel", "🛁", [
        ["Basic", "$5K – $15K"],
        ["Mid-range (most popular)", "$15K – $35K"],
        ["Premium", "$35K – $80K"],
      ], "2 – 8 weeks · Permits: building, plumbing, electrical, mechanical (vent fan)")}

      ${section("Roofing", "🏠", [
        ["Basic — 3-tab asphalt", "$5K – $15K"],
        ["Mid — architectural shingles", "$10K – $25K"],
        ["Premium — metal / slate / tile", "$25K – $80K"],
      ], "1 – 4 weeks · Permits: building (re-roof) + wind / HOA where applicable")}

      ${section("Painting", "🎨", [
        ["Basic — walls only", "$1.5K – $5K"],
        ["Mid — full prep + premium paint", "$4K – $12K"],
        ["Premium — skim + designer paint", "$10K – $30K"],
      ], "1 – 4 weeks · Usually no permits (lead-safe RRP for pre-1978 homes)")}

      <div style="margin-top:18px;padding:14px 18px;background:#eef1f5;border-radius:10px">
        <div style="font-weight:700;color:#0f2940;font-size:13px;margin-bottom:8px">Regional adjustment — multiply the base price by:</div>
        <div style="font-size:13.5px;color:#1a1f2e;line-height:1.7">
          🌲 <strong>Northeast</strong> +25–30% &nbsp;·&nbsp;
          🌊 <strong>West Coast</strong> +30–35% &nbsp;·&nbsp;
          🌴 <strong>South</strong> -5% &nbsp;·&nbsp;
          🌽 <strong>Midwest</strong> -10%
        </div>
      </div>

      <h2 style="font-size:18px;font-weight:700;color:#0f2940;margin:28px 0 10px">
        5 questions to ask <em>any</em> contractor before hiring
      </h2>
      <ol style="font-size:14.5px;line-height:1.7;color:#1a1f2e;padding-left:22px;margin:0">
        <li>Are you licensed in this state? <em style="color:#6b7280">(verify directly with the licensing board)</em></li>
        <li>Can I see your current liability insurance certificate?</li>
        <li>What's your written workmanship warranty?</li>
        <li>Who pulls the permits — you or me?</li>
        <li>How are change orders priced and approved?</li>
      </ol>

      <div style="margin-top:30px;padding:22px;border-top:1px solid #dfe4ec;text-align:center">
        <h3 style="font-size:18px;font-weight:700;color:#0f2940;margin:0 0 8px">Want a regional estimate for <em>your</em> project?</h3>
        <p style="font-size:14px;color:#6b7280;margin:0 0 16px">60 seconds · free · no contact info needed</p>
        <a href="${SITE_URL}/cost-calculator" style="display:inline-block;padding:13px 26px;background:#6b8e6b;color:#fff !important;text-decoration:none;border-radius:10px;font-size:14.5px;font-weight:700;margin-right:8px">
          Try the calculator
        </a>
        <a href="${SITE_URL}/" style="display:inline-block;padding:13px 26px;background:#0f2940;color:#fff !important;text-decoration:none;border-radius:10px;font-size:14.5px;font-weight:700;margin-top:8px">
          Get matched in 24 hrs
        </a>
      </div>

      <p style="font-size:12px;color:#6b7280;margin-top:24px;line-height:1.6">
        Free, no obligation. We never sell your information and we don&apos;t charge per-lead fees that get passed into your quotes.
      </p>
    </div>

    <div style="padding:16px 28px;background:#fafafa;border-top:1px solid #dfe4ec;color:#6b7280;font-size:11.5px;text-align:center">
      © ${new Date().getFullYear()} Purple Heart Pros LLC · mail@purpleheartpros.com<br>
      You're receiving this because you requested the Domustack cheatsheet. Reply UNSUBSCRIBE to stop.
    </div>
  </div>
</body></html>`;

  return { subject, html, text };
}

function section(
  title: string,
  emoji: string,
  rows: [string, string][],
  meta: string
): string {
  return `
  <div style="margin-top:22px">
    <div style="display:flex;align-items:center;gap:8px;font-size:17px;font-weight:700;color:#0f2940;margin-bottom:10px">
      <span style="font-size:22px">${emoji}</span> ${title}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:6px 0;color:#1a1f2e">${label}</td>
          <td style="padding:6px 0;color:#0f2940;font-weight:700;text-align:right">${value}</td>
        </tr>`
        )
        .join("")}
    </table>
    <div style="font-size:12.5px;color:#6b7280;margin-top:6px">${meta}</div>
  </div>`;
}
