import HeaderComponent from "./components/HeaderComponent";

function FrontpageContent() {
    return (
        <>
            <div className="content-card-flex">
                <h2>Welcome to The lodge</h2>
                <p>
                    This is a discussion forum / content sharing site for sharing online content and discussing topics of your interest.
                </p>
                <p>
                    The lodge is ment for adults and the content will reflect this. Viewers browse this site at their own responsibility.
                    We focus on minimal amount of censorship and moderation. This site celebrates free speech, but we recommend civility and
                    "gown-up" conversations.
                </p>
                <p>
                    This is a text only website so any image or video content must be hosted on different domains. Linking to illegal websites
                    or any illegal content is prohibited and such content will be removed.
                </p>
                <p>
                    Contact us if you have any complaints, positive or negative, but constructive, critcism. We will listen and develop the
                    site to maximize the user experience.
                    <br />
                    <br />
                    admin@thelodge.com
                </p>
                <p>
                    Sincerely, the Lodge admin.
                </p>
            </div>   
        </>
    );
}

export default FrontpageContent;