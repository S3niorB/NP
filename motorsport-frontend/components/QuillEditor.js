import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import {
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiFillFacebook,
} from "react-icons/ai";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Input, Modal, message } from "antd";

const BlockEmbed = Quill.import('blots/block/embed');

class TwitterEmbedBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute('data-twitter-url', url);
    node.setAttribute('contenteditable', false);
    node.setAttribute('data-twitter-rendered', 'false');
    return node;
  }

  static value(node) {
    return node.getAttribute('data-twitter-url');
  }
}
TwitterEmbedBlot.blotName = 'twitter';
TwitterEmbedBlot.tagName = 'div';
Quill.register(TwitterEmbedBlot);

class InstagramPostBlot extends BlockEmbed {
  static create(url) {
    const node = super.create();
    node.setAttribute('data-instagram-url', url);
    const embedCode = `<iframe src="${url}embed" width="400" height="500" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
    node.innerHTML = embedCode;
    return node;
  }

  static value(node) {
    return node.getAttribute('data-instagram-url');
  }
}
InstagramPostBlot.blotName = 'instagram';
InstagramPostBlot.tagName = 'div';
Quill.register(InstagramPostBlot);

class FacebookEmbedBlot extends BlockEmbed {
  static create(postUrl) {
    const node = super.create();
    node.setAttribute('data-facebook-url', postUrl);
    const embedCode = `<iframe src="https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(postUrl)}&show_text=true&width=500" width="500" height="500" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>`;
    node.innerHTML = embedCode;
    return node;
  }

  static value(node) {
    return node.getAttribute('data-facebook-url');
  }
}
FacebookEmbedBlot.blotName = 'facebook';
FacebookEmbedBlot.tagName = 'div';
Quill.register(FacebookEmbedBlot);

const loadTwitterWidgetScript = (callback) => {
  if (!window.twttr) {
    const script = document.createElement('script');
    script.src = "https://platform.twitter.com/widgets.js";
    script.onload = callback;
    document.body.appendChild(script);
  } else {
    callback();
  }
};

export const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const socialToolOptions = {
    twitter: {
      label: "Twitter",
      active: true,
      description: "Add Twitter Url",
      icon: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></svg>`,
    },
    instagram: {
      label: "Instagram",
      active: true,
      description: "Add Instagram Url",
      icon: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path></svg>`,
    },
    facebook: {
      label: "Facebook",
      active: true,
      description: "Add Facebook Post Url",
      icon: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>`,
    },
  };
  
  const AdvancedQuillEditor = ({ value, onChange }) => {
    const quillRef = useRef(null);
    const [socialTools, setSocialTools] = useState({
      active: false,
      label: "",
      code: "",
      description: "",
    });
  
    useEffect(() => {
      loadTwitterWidgetScript(() => {
        console.log("Twitter widget script loaded");
      });
  
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const toolbar = editor.getModule('toolbar');
        
        // Saját konténer hozzáadása az eszköztárhoz
        const socialButtonsContainer = document.createElement('span');
        socialButtonsContainer.className = 'ql-formats';
        toolbar.container.appendChild(socialButtonsContainer);
  
        // Social media gombok hozzáadása
        Object.entries(socialToolOptions).forEach(([key, value]) => {
          const button = document.createElement('button');
          button.innerHTML = value.icon;
          button.className = `ql-${key}`;
          button.title = value.label;
          button.addEventListener('click', () => {
            setSocialTools({
              active: true,
              label: value.label,
              code: "",
              description: value.description,
            });
          });
          socialButtonsContainer.appendChild(button);
        });
      }
    }, []);

  const getTweetIdFromUrl = (url) => {
    const regex = /https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
    const match = url.match(regex);
    if (match && match[2]) {
      return match[2];
    }
    return null;
  };

  const handleTwitterEmbed = (mediaUrl) => {
    const tweetId = getTweetIdFromUrl(mediaUrl);
    if (tweetId) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'twitter', mediaUrl);
      editor.setSelection(range.index + 1);

      setTimeout(() => {
        const twitterElements = document.querySelectorAll('[data-twitter-rendered="false"]');
        twitterElements.forEach((element) => {
          if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.createTweet(tweetId, element)
              .then(() => {
                element.setAttribute('data-twitter-rendered', 'true');
              })
              .catch((error) => {
                console.error('Error rendering tweet:', error);
                element.textContent = 'Tweet could not be loaded';
                message.error('Error loading tweet. Please check the URL and try again.');
              });
          }
        });
      }, 100);
    } else {
      console.error('Invalid Twitter URL');
      message.error('Invalid Twitter URL. Please make sure you\'re using a valid twitter.com or x.com URL.');
    }
  };

  const insertInstagramPost = (mediaUrl) => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, 'instagram', mediaUrl);
  };

  const handleFacebookEmbed = (postUrl) => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, 'facebook', postUrl);
  };

  const modal = (data) => {
    return (
      <Modal
        title=""
        open={socialTools.active}
        onOk={() => {
          if (socialTools.label === "Twitter") {
            handleTwitterEmbed(socialTools.code);
          } else if (socialTools.label === "Instagram") {
            insertInstagramPost(socialTools.code);
          } else if (socialTools.label === "FaceBook") {
            handleFacebookEmbed(socialTools.code);
          }
          setSocialTools({
            ...socialTools,
            active: false,
            label: "",
            code: "",
            description: "",
          });
        }}
        onCancel={() =>
          setSocialTools({
            ...socialTools,
            active: false,
            label: "",
            code: "",
            description: "",
          })
        }
      >
        <h3>{data.label} Tool</h3>
        <Input
          placeholder={data.description}
          onChange={(e) => {
            setSocialTools({ ...socialTools, code: e.target.value });
          }}
        />
      </Modal>
    );
  };

  return (
    <div className="text-editor flex justify-center flex-col items-center">
      <div className="w-[80vw]">
        <ReactQuill
          className="quillEditor-container"
          modules={modules}
          value={value}
          placeholder="Enter Something...."
          theme="snow"
          ref={quillRef}
          onChange={onChange}
        />
        {socialTools.active && modal(socialTools)}
      </div>
    </div>
  );
};

export default AdvancedQuillEditor;