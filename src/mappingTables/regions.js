import _ from "lodash";

export const regions = {
    "BR":true,
    "EMEA":true,
    "LAS":true,
    "NA":true,
    "AP":true,
 };

 /*return only true regions from array 
use keys and picky by function by lodash */
export default _.keys(_.pickBy(regions));;