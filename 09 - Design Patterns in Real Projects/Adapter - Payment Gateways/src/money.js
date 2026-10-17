'use strict';
// Domain value types. JavaScript has no enums, so regions and gateway ids are
// frozen string constants. Money is ALWAYS stored in integer MINOR units
// (cents / paise) to avoid floating-point drift on currency amounts.

const Region = Object.freeze({ India: 'India', USA: 'USA', Europe: 'Europe' });
const GatewayId = Object.freeze({ Stripe: 'Stripe', Razorpay: 'Razorpay', PayPal: 'PayPal' });

/** @returns {{minorUnits:number, currency:string, major:() => number}} */
function money(minorUnits, currency) {
  return { minorUnits, currency, major: () => minorUnits / 100 };
}

function ok(transactionId, gateway) {
  return { success: true, transactionId, gateway, error: '' };
}
function fail(error, gateway) {
  return { success: false, transactionId: '', gateway, error };
}

module.exports = { Region, GatewayId, money, ok, fail };
