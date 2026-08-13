// CAVE Apple Wallet Style Digital Driving Licence Pass Component

export function renderAppleWalletPass(customer) {
  if (!customer) return '';

  return `
    <div style="width: 100%; max-width: 360px; background: linear-gradient(135deg, #1C1C1E 0%, #000000 100%); border-radius: 20px; padding: 22px; color: #FFFFFF; box-shadow: 0 16px 32px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15); position: relative; overflow: hidden;">
      
      <!-- Apple Wallet Metallic Shimmer Accent -->
      <div style="position: absolute; top: -50px; right: -50px; width: 140px; height: 140px; background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; pointer-events: none;"></div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <div class="label-meta" style="color: #8E8E93; font-size: 9px;">CAVE AUTOMOTIVE PASS</div>
          <div style="font-size: 18px; font-weight: 900; letter-spacing: 0.05em; color: #FFFFFF; margin-top: 2px;">CAVE REGISTERED DRIVER</div>
        </div>
        <div style="background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; color: #34C759;">
          VERIFIED ✓
        </div>
      </div>

      <!-- Customer Avatar & Info -->
      <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 20px;">
        ${customer.licenceImage ? `
          <div style="width: 60px; height: 60px; border-radius: 12px; overflow: hidden; border: 2px solid rgba(255,255,255,0.3); flex-shrink: 0;">
            <img src="${customer.licenceImage}" alt="Driver Photo" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        ` : `
          <div style="width: 60px; height: 60px; border-radius: 12px; background: #2C2C2E; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; color: #FFF;">
            ${customer.fullName.charAt(0)}
          </div>
        `}

        <div>
          <div style="font-size: 16px; font-weight: 800; letter-spacing: -0.01em;">${customer.fullName}</div>
          <div class="mono-val" style="font-size: 11px; color: #8E8E93; margin-top: 2px;">LIC: ${customer.licenceNumber}</div>
          <div class="mono-val" style="font-size: 10px; color: #8E8E93;">EXP: ${customer.licenceExpiry}</div>
        </div>
      </div>

      <!-- Footer Barcode & Agreement Status -->
      <div style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="label-meta" style="color: #636366; font-size: 8px;">DIGITAL CONTRACT</div>
          <div style="font-size: 11px; font-weight: 700; color: ${customer.agreementSigned ? '#34C759' : '#FF3B30'}; margin-top: 2px;">
            ${customer.agreementSigned ? 'AGREEMENT SIGNED ✓' : 'PENDING SIGNATURE'}
          </div>
        </div>
        
        <!-- Apple Wallet Barcode Simulator -->
        <div style="background: #FFFFFF; padding: 4px 8px; border-radius: 4px; display: flex; gap: 2px; align-items: center; height: 24px;">
          <div style="width: 2px; height: 16px; background: #000;"></div>
          <div style="width: 4px; height: 16px; background: #000;"></div>
          <div style="width: 1px; height: 16px; background: #000;"></div>
          <div style="width: 3px; height: 16px; background: #000;"></div>
          <div style="width: 2px; height: 16px; background: #000;"></div>
          <div style="width: 5px; height: 16px; background: #000;"></div>
        </div>
      </div>

    </div>
  `;
}
