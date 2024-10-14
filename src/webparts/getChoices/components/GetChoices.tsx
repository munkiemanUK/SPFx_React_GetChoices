import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './GetChoices.module.scss';
import type { IGetChoicesProps } from './IGetChoicesProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { SPFx,spfi } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

const GetChoices: React.FC<IGetChoicesProps> = ({ webURL, context }) => {
  const [changeTabs, setChangeTabs] = useState<string[]>([]);

  useEffect(() => {
    const sp = spfi().using(SPFx(context));
    const getChangeTabs = async () => {
      try {
        const list = await sp.web.lists.getByTitle("Change_Alerts").fields.getByTitle("ChangeType")();
        const choices = list.Choices as string[];
        console.log("choices",choices);
        setChangeTabs(choices);
      } catch (error) {
        console.error("Error fetching change tabs: ", error);
      }
    };

    getChangeTabs();
  }, [context]);

  return (
    <div className={styles.getChoices}>

      {changeTabs.length === 0 ? (
        <div>There currently are no change alerts to display</div>
      ) : (
        <div>
          <ul id="changeTabs" className="nav nav-tabs">
            {changeTabs.map((tab, index) => (
              <li className="nav-item">
                <a
                  key={index}
                  className={`nav-link ${index === 0 ? 'active show' : ''}`}
                  data-bs-toggle="tab"
                  href={`#chgtab${index}`}
                  role="tab"
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>
          <div id="changeContent" className="tab-content">
            {changeTabs.map((tab, index) => (
              <div
                key={index}
                id={`chgtab${index}`}
                className={`tab-pane fade container ${index === 0 ? 'active show' : ''}`}
                role="tabpanel"
              >
                <h5>Change Tab {tab} content</h5>
                <div className="row" style={{ marginBottom: '10px' }} id={`change${index}`}>
                  <div id={`chg${index}`} className="card"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetChoices;