// 📧 1. CLIENT EMAIL TEMPLATE (Dedicated Jasa Backlinks / Google Workspace Theme)
const getClientEmailHtml = ({
  customer,
  transactionId,
  paymentMethod,
  totalLinks,
  totalAmount,
  packages,
}) => {
  const safePackages = Array.isArray(packages) ? packages : [];

  const packageRowsHtml = safePackages
    .map(
      (pkg) => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e8eaed;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="52" valign="middle" style="padding-right: 10px;">
                <span style="display: inline-block; background-color: #e8f0fe; color: #1a73e8; font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 999px; text-align: center;">
                  ${Number(pkg.qty || 0).toLocaleString()}
                </span>
              </td>
              <td valign="middle">
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #202124; line-height: 1.3;">
                  ${pkg.name}
                </p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #5f6368;">
                  DA/DR 50+ Contextual Placement
                </p>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" valign="middle" style="padding: 14px 16px; border-bottom: 1px solid #e8eaed; font-size: 14px; font-weight: 600; color: #202124; white-space: nowrap;">
          $${Number(pkg.subtotal || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    `,
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Jasa Backlinks</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #202124;">
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; padding: 36px 16px;">
      <tr>
        <td align="center">
          
          <!-- Main Card Container -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #dadce0; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 36px rgba(60, 64, 67, 0.08);">
            
            <!-- Signature 4-Colour Top Bar -->
            <tr>
              <td style="padding: 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="25%" height="4" style="background-color: #4285F4; font-size: 0; line-height: 0;">&nbsp;</td>
                    <td width="25%" height="4" style="background-color: #EA4335; font-size: 0; line-height: 0;">&nbsp;</td>
                    <td width="25%" height="4" style="background-color: #FBBC04; font-size: 0; line-height: 0;">&nbsp;</td>
                    <td width="25%" height="4" style="background-color: #34A853; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Top Brand Header -->
            <tr>
              <td style="padding: 28px 32px 20px; border-bottom: 1px solid #e8eaed;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="middle">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #4285F4; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #EA4335; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #FBBC04; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #34A853; margin-right: 8px;"></span>
                      <span style="font-size: 18px; font-weight: 700; color: #202124; letter-spacing: -0.3px; vertical-align: middle;">
                        Jasa Backlinks
                      </span>
                    </td>
                    <td align="right" valign="middle">
                      <span style="display: inline-block; background-color: #e6f4ea; color: #1e8e3e; border: 1px solid #ceead6; font-size: 11.5px; font-weight: 600; padding: 4px 12px; border-radius: 999px;">
                        ● Payment Verified
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hero Status Banner -->
            <tr>
              <td style="padding: 28px 32px 24px; background-color: #f8fbff; border-bottom: 1px solid #e8eaed;">
                <div style="display: inline-block; background-color: #e8f0fe; color: #1a73e8; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px; margin-bottom: 12px;">
                  Official Campaign Receipt
                </div>
                <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 600; color: #202124; letter-spacing: -0.5px; line-height: 1.25;">
                  Your campaign is queued for <span style="color: #1a73e8;">placement.</span>
                </h1>
                <p style="margin: 0; font-size: 14.5px; color: #5f6368; line-height: 1.6;">
                  Hi <strong style="color: #202124;">${customer?.fullName || "Valued Partner"}</strong>, thank you for partnering with Jasa Backlinks. Our SEO team has received your target URLs and anchor texts and started processing your <strong style="color: #1a73e8;">${Number(totalLinks || 0).toLocaleString()} DA/DR 50+ backlinks</strong>.
                </p>
              </td>
            </tr>

            <!-- Main Body Content -->
            <tr>
              <td style="padding: 28px 32px;">
                
                <!-- Payment & Contact Metadata Box -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border: 1px solid #e8eaed; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                  <tr>
                    <td width="50%" valign="top" style="padding-bottom: 14px; border-bottom: 1px solid #e8eaed;">
                      <p style="margin: 0; font-size: 11.5px; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Transaction ID</p>
                      <p style="margin: 4px 0 0; font-size: 13.5px; color: #202124; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-weight: 600;">
                        ${transactionId}
                      </p>
                    </td>
                    <td width="50%" valign="top" align="right" style="padding-bottom: 14px; border-bottom: 1px solid #e8eaed;">
                      <p style="margin: 0; font-size: 11.5px; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Payment Method</p>
                      <p style="margin: 4px 0 0; font-size: 13.5px; color: #202124; font-weight: 600;">
                        ${paymentMethod}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%" valign="top" style="padding-top: 14px;">
                      <p style="margin: 0; font-size: 11.5px; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Registered Contact</p>
                      <p style="margin: 4px 0 0; font-size: 13.5px; color: #202124; font-weight: 600;">
                        ${customer?.contactPlatform || "Direct"}: <span style="color: #1a73e8;">${customer?.contactHandle || customer?.email}</span>
                      </p>
                    </td>
                    <td width="50%" valign="top" align="right" style="padding-top: 14px;">
                      <p style="margin: 0; font-size: 11.5px; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Estimated Turnaround</p>
                      <p style="margin: 4px 0 0; font-size: 13.5px; color: #1e8e3e; font-weight: 600;">
                        5–7 Business Days
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Order Summary Breakdown -->
                <div style="margin-bottom: 12px;">
                  <span style="font-size: 15px; font-weight: 600; color: #202124;">Order Summary</span>
                  <span style="float: right; font-size: 12px; font-weight: 600; color: #1a73e8; background-color: #e8f0fe; padding: 2px 10px; border-radius: 999px;">
                    ${Number(totalLinks || 0).toLocaleString()} Total Links
                  </span>
                </div>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e8eaed; border-radius: 16px; overflow: hidden; margin-bottom: 24px;">
                  <thead>
                    <tr style="background-color: #f8f9fa;">
                      <th align="left" style="padding: 12px 16px; font-size: 11.5px; color: #5f6368; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e8eaed;">Placement Package</th>
                      <th align="right" style="padding: 12px 16px; font-size: 11.5px; color: #5f6368; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e8eaed;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${packageRowsHtml}
                    <tr style="background-color: #f8fbff;">
                      <td style="padding: 16px; font-size: 15px; font-weight: 600; color: #202124;">
                        Total Amount Paid
                        <span style="display: block; font-size: 11.5px; font-weight: 500; color: #1e8e3e; margin-top: 2px;">● Instant Setup & White-Label Report Included</span>
                      </td>
                      <td align="right" style="padding: 16px; font-size: 22px; font-weight: 700; color: #1a73e8; white-space: nowrap;">
                        $${Number(totalAmount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} <span style="font-size: 12px; font-weight: 500; color: #5f6368;">USD</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Direct Team Contacts Box (Matches Popup 3) -->
                <div style="background-color: #f8f9fa; border: 1px solid #e8eaed; border-radius: 16px; padding: 20px; text-align: center;">
                  <p style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #202124;">
                    Need Instant Assistance or Custom Drip-Feed Adjustments?
                  </p>
                  <p style="margin: 0 0 16px; font-size: 12.5px; color: #5f6368;">
                    Connect with your dedicated campaign manager on any of our 3 official channels:
                  </p>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td width="32%" align="center" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 12px; padding: 10px 6px;">
                        <a href="https://wa.me/6281234567890" style="text-decoration: none; display: block;">
                          <span style="display: block; font-size: 11px; color: #5f6368; font-weight: 500;">WhatsApp</span>
                          <span style="display: block; font-size: 12.5px; color: #1e8e3e; font-weight: 600; margin-top: 2px;">Chat Now ↗</span>
                        </a>
                      </td>
                      <td width="2%"></td>
                      <td width="32%" align="center" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 12px; padding: 10px 6px;">
                        <a href="https://t.me/jasabacklinks" style="text-decoration: none; display: block;">
                          <span style="display: block; font-size: 11px; color: #5f6368; font-weight: 500;">Telegram</span>
                          <span style="display: block; font-size: 12.5px; color: #1a73e8; font-weight: 600; margin-top: 2px;">@jasabacklinks</span>
                        </a>
                      </td>
                      <td width="2%"></td>
                      <td width="32%" align="center" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 12px; padding: 10px 6px;">
                        <a href="mailto:jasa-backlinks@seohubltd.com" style="text-decoration: none; display: block;">
                          <span style="display: block; font-size: 11px; color: #5f6368; font-weight: 500;">Support Desk</span>
                          <span style="display: block; font-size: 12.5px; color: #f29900; font-weight: 600; margin-top: 2px;">Email Team</span>
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f8f9fa; padding: 20px 32px; border-top: 1px solid #e8eaed;">
                <p style="margin: 0; font-size: 12px; color: #5f6368;">
                  &copy; ${new Date().getFullYear()} Jasa Backlinks • Enterprise Link Infrastructure (DA/DR 50+)
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #9aa0a6;">
                  Powered by <a href="https://seohub.ltd" style="color: #1a73e8; text-decoration: none; font-weight: 600;">SeoHub Ltd</a>
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>`;
};

// 📧 2. ADMIN EMAIL TEMPLATE (Exact Same Website Theme - Clean Executive Dispatch)
const getAdminEmailHtml = ({
  customer,
  transactionId,
  paymentMethod,
  totalLinks,
  totalAmount,
  packages,
}) => {
  const safePackages = Array.isArray(packages) ? packages : [];

  const packageRowsHtml = safePackages
    .map(
      (pkg) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e8eaed;">
          <span style="display: inline-block; background-color: #e8f0fe; color: #1a73e8; font-size: 11.5px; font-weight: 700; padding: 2px 9px; border-radius: 999px; margin-right: 8px;">
            ${Number(pkg.qty || 0).toLocaleString()}
          </span>
          <span style="font-size: 14px; font-weight: 600; color: #202124;">
            ${pkg.name}
          </span>
        </td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #e8eaed; font-size: 14px; font-weight: 600; color: #202124; white-space: nowrap;">
          $${Number(pkg.subtotal || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    `,
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Dispatch - Jasa Backlinks</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #202124;">
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; padding: 36px 16px;">
      <tr>
        <td align="center">
          
          <!-- Main Card Container -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #dadce0; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 36px rgba(60, 64, 67, 0.08);">
            
            <!-- Signature 4-Colour Top Bar -->
            <tr>
              <td style="padding: 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="25%" height="4" style="background-color: #4285F4; font-size: 0; line-height: 0;">&nbsp;</td>
                    <td width="25%" height="4" style="background-color: #EA4335; font-size: 0; line-height: 0;">&nbsp;</td>
                    <td width="25%" height="4" style="background-color: #FBBC04; font-size: 0; line-height: 0;">&nbsp;</td>
                    <td width="25%" height="4" style="background-color: #34A853; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Top Brand & Admin Alert Header -->
            <tr>
              <td style="padding: 26px 32px 20px; border-bottom: 1px solid #e8eaed;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="middle">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #4285F4; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #EA4335; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #FBBC04; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #34A853; margin-right: 8px;"></span>
                      <span style="font-size: 18px; font-weight: 700; color: #202124; letter-spacing: -0.3px; vertical-align: middle;">
                        Jasa Backlinks Admin
                      </span>
                    </td>
                    <td align="right" valign="middle">
                      <span style="display: inline-block; background-color: #e8f0fe; color: #1a73e8; border: 1px solid #d2e3fc; font-size: 11.5px; font-weight: 600; padding: 4px 12px; border-radius: 999px;">
                        ● New Campaign Order
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Revenue & Volume Banner -->
            <tr>
              <td style="padding: 26px 32px; background-color: #f8fbff; border-bottom: 1px solid #e8eaed;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="middle">
                      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #1e8e3e; text-transform: uppercase; letter-spacing: 0.5px;">
                        ● Payment Captured (${paymentMethod})
                      </p>
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #202124; letter-spacing: -0.5px;">
                        +$${Number(totalAmount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} <span style="font-size: 14px; font-weight: 500; color: #5f6368;">USD</span>
                      </h1>
                      <p style="margin: 4px 0 0; font-size: 12.5px; color: #5f6368; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;">
                        TXN ID: <strong style="color: #202124;">${transactionId}</strong>
                      </p>
                    </td>
                    <td align="right" valign="middle">
                      <div style="display: inline-block; background-color: #ffffff; border: 1px solid #d2e3fc; border-radius: 14px; padding: 10px 16px; text-align: center;">
                        <span style="display: block; font-size: 11px; color: #5f6368; font-weight: 600; text-transform: uppercase;">Total Volume</span>
                        <span style="display: block; font-size: 18px; color: #1a73e8; font-weight: 700; margin-top: 2px;">
                          ${Number(totalLinks || 0).toLocaleString()} Links
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Admin Content -->
            <tr>
              <td style="padding: 28px 32px;">
                
                <!-- Client & Mandatory Contact Cards -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td width="48%" valign="top" style="background-color: #f8f9fa; border: 1px solid #e8eaed; border-radius: 16px; padding: 18px;">
                      <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.6px;">
                        Client Details
                      </p>
                      <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #202124;">
                        ${customer?.fullName || "N/A"}
                      </p>
                      <a href="mailto:${customer?.email || ""}" style="font-size: 13.5px; color: #1a73e8; text-decoration: none; font-weight: 500; word-break: break-all;">
                        ${customer?.email || "N/A"}
                      </a>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" valign="top" style="background-color: #fef7e0; border: 1px solid #fde293; border-radius: 16px; padding: 18px;">
                      <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; color: #b06000; text-transform: uppercase; letter-spacing: 0.6px;">
                        Direct Contact (${customer?.contactPlatform || "Mandatory"})
                      </p>
                      <p style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #202124; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;">
                        ${customer?.contactHandle || "Not Provided"}
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #5f6368;">
                        Use for instant report & campaign updates
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Target URLs Box -->
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">
                  Submitted Target URLs
                </p>
                <div style="background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 14px; padding: 16px; margin-bottom: 20px;">
                  <pre style="margin: 0; font-size: 13.5px; color: #1a73e8; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; white-space: pre-wrap; word-wrap: break-word; line-height: 1.55;">${customer?.targetUrls || "No URLs provided"}</pre>
                </div>

                <!-- Target Keywords / Anchor Texts Box -->
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">
                  Submitted Keywords / Anchor Texts
                </p>
                <div style="background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 14px; padding: 16px; margin-bottom: 20px;">
                  <pre style="margin: 0; font-size: 13.5px; color: #202124; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; white-space: pre-wrap; word-wrap: break-word; line-height: 1.55;">${customer?.anchorTexts || "No keywords provided"}</pre>
                </div>

                <!-- Special Instructions Box -->
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">
                  Special Instructions / Drip-Feed Notes
                </p>
                <div style="background-color: #f8fbff; border: 1px solid #d2e3fc; border-radius: 14px; padding: 14px 16px; margin-bottom: 24px;">
                  <p style="margin: 0; font-size: 13.5px; color: #3c4043; line-height: 1.5;">
                    ${customer?.notes ? customer.notes : "Standard 5–7 days turnaround (No custom notes submitted)."}
                  </p>
                </div>

                <!-- Ordered Packages Table -->
                <p style="margin: 0 0 10px; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">
                  Ordered Placements Breakdown
                </p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e8eaed; border-radius: 16px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #f8f9fa;">
                      <th align="left" style="padding: 11px 16px; font-size: 11.5px; color: #5f6368; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e8eaed;">Package & Volume</th>
                      <th align="right" style="padding: 11px 16px; font-size: 11.5px; color: #5f6368; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e8eaed;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${packageRowsHtml}
                    <tr style="background-color: #f8f9fa;">
                      <td style="padding: 14px 16px; font-size: 14px; font-weight: 600; color: #202124;">
                        Total Captured Revenue
                      </td>
                      <td align="right" style="padding: 14px 16px; font-size: 18px; font-weight: 700; color: #1e8e3e;">
                        $${Number(totalAmount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} USD
                      </td>
                    </tr>
                  </tbody>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f8f9fa; padding: 18px 32px; border-top: 1px solid #e8eaed;">
                <p style="margin: 0; font-size: 12px; color: #5f6368;">
                  Jasa Backlinks Automated Order Dispatch • Powered by SeoHub Ltd
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>`;
};

module.exports = { getClientEmailHtml, getAdminEmailHtml };