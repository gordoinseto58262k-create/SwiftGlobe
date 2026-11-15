const CODES = "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW HK MO PR".split(" ");
const EUR = "AD AT BE HR CY EE FI FR DE GR IE IT LV LT LU MT MC ME NL PT SM SK SI ES VA".split(" ");
const CUR: Record<string, [string, number]> = {
  US:["USD",1],BR:["BRL",5.4],MX:["MXN",18.2],IN:["INR",84.5],PH:["PHP",58.6],CO:["COP",4150],GB:["GBP",0.78],
  CA:["CAD",1.38],AR:["ARS",980],CL:["CLP",940],PE:["PEN",3.75],JP:["JPY",152],CN:["CNY",7.2],NG:["NGN",1600],
  PK:["PKR",278],BD:["BDT",120],VN:["VND",25300],GT:["GTQ",7.7],HN:["HNL",24.9],DO:["DOP",60.3],AU:["AUD",1.52],
  CH:["CHF",0.88],ZA:["ZAR",18],KE:["KES",129],GH:["GHS",15.8],EG:["EGP",48.6],MA:["MAD",9.9],TR:["TRY",34.3],
  KR:["KRW",1390],ID:["IDR",15700],TH:["THB",34.5],UY:["UYU",41.5],PY:["PYG",7800],BO:["BOB",6.9],NP:["NPR",135],
  LK:["LKR",293],PL:["PLN",4.0],SE:["SEK",10.6],NO:["NOK",10.9],DK:["DKK",6.9],AE:["AED",3.67],SA:["SAR",3.75],
};
const names = new Intl.DisplayNames(["en"], { type: "region" });
const flag = (c: string) => `https://flagcdn.com/w40/${c.toLowerCase()}.png`;
export type Country = { code: string; name: string; flag: string; currency: string; rate: number };
export const COUNTRIES: Country[] = CODES.map((code) => {
  const [currency, rate] = EUR.includes(code) ? ["EUR", 0.92] : CUR[code] ?? ["USD", 1];
  return { code, name: names.of(code) ?? code, flag: flag(code), currency, rate };
}).sort((a, b) => a.name.localeCompare(b.name, "en"));
