import React from 'react';
import './Popup.css';

enum Actions {
  'DRAFT' = 'DRAFT',
  'READY_FOR_REVIEW' = 'READY_FOR_REVIEW',
  'COMMENTS_ADDED' = 'COMMENTS_ADDED',
  'COMMENTS_ADDRESSED' = 'COMMENTS_ADDRESSED',
  'ACCEPTED' = 'ACCEPTED',
  'REJECTED' = 'REJECTED',
}

const actionTexts: Record<Actions, string> = {
  DRAFT: 'Draft',
  READY_FOR_REVIEW: 'Ready for review',
  COMMENTS_ADDED: 'Comments Added',
  COMMENTS_ADDRESSED: 'Comments Addressed',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

const Popup = () => {
  const diffId = React.useMemo(() => window.location.pathname.slice(1), []);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState<Actions>();

  React.useEffect(() => {
    // fetch('xyz.com/status')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setLoading(false);
    //     setStatus(data.status);
    //   });
    // fetch('https://phabricator.rubrik.com/H463')
    //   .then((res) => res.text())
    //   .then(console.log);
    setTimeout(() => {
      setLoading(false);
      setStatus(Actions.DRAFT);
    }, 1000);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="Actions">
          {Object.entries(actionTexts).map(([actionValue, actionText]) => (
            <button
              disabled={loading || status === actionValue}
              onClick={() => {
                setLoading(true);
                // fetch('xyz.com', {
                //   method: 'POST',
                //   body: JSON.stringify({ diffId, actionValue }),
                // });
                setTimeout(() => {
                  setLoading(false);
                  setStatus(actionValue as Actions);
                }, 1000);
              }}
            >
              {actionText}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Popup;
