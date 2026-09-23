const { toUSDTBalances } = require("../helper/balances");
const { get } = require('../helper/http')

async function staking() {
  // Get the OGY supply metrics
  // Ref: https://gateway.origyn.com/docs/#/Tokens/get_origyn_supply_summary
  const supplyUrl = 'https://gateway.origyn.com/v1/tokens/OGY/supply/summary';
  const supplyData = await get(supplyUrl);
  const totalSupply = Number(BigInt(supplyData.total_supply)) / 1e8;
  const circulatingSupply = Number(BigInt(supplyData.circulating_supply)) / 1e8;
  
  
  // Get the OGY/USDT market price
  const ogyPriceUrl = 'https://api.origyn.com/ogy/price';
  const ogyPriceData = await get(ogyPriceUrl);
  const ogyUsdt = ogyPriceData.ogyPrice;

  // The token value locked is the locked supply
  // total supply - circulating supply
  const tokenTvl = (totalSupply - circulatingSupply) * ogyUsdt;

  return toUSDTBalances(tokenTvl);
}

async function tvl() {
  // Get the total value of ORIGYN Certificates
  // Ref: https://github.com/ORIGYN-SA/origyn-sns/blob/master/backend/canisters/collection_index/impl/src/queries/http_request.rs#L29
  const collectionIndexUrl = 'https://leqqw-uaaaa-aaaaj-azsba-cai.raw.icp0.io/stats';
  const collectionIndexData = await get(collectionIndexUrl);
  const collectionTvl = collectionIndexData.total_value_locked;

  return toUSDTBalances(collectionTvl);
}

module.exports = {
  timetravel: false,
  methodology: "TVL the total locked value of staked tokens and the total asset value of ORIGYN certificates.",
  icp: {
    tvl,
    staking,
  },
}