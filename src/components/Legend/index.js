import React from 'react'
import "./style.css";
import languages from "../../mappingTables/languageTranslations";

const urlParams = new URLSearchParams(window.location.search);
const languageParam = urlParams.get("lang");

export default ({ page: page }) => {

    let message = '';
    if (languageParam !== null) {
        message = languages.filter((d, i) => d.key === languageParam)[0].legendMsg;
    } else {
        message = languages.filter((d, i) => d.key === 'EN_US')[0].legendMsg;
    }
    let classes = ['Legend'];
    if (page === 'sales') {
        classes = ['Sales-Legend']
    }
    return (
        <div className={classes}>
            <span>{message}</span>
            {/* Click on a KPI object to access detailed data of the KPI */}
        </div>
    )
}


