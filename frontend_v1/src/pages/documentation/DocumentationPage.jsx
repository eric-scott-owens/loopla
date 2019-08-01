import React from 'react';
import PageInitializer from '../PageInitializer';

import "./DocumentationPage.scss";

const DocumentationPage = () => (
  <PageInitializer>
    <div className="o-documentation-page">
      <h1>Loopla Styling Documentation</h1>

      <div className="o-section o-toc">
        <div><a href="#section-text">Text</a></div>
        <div className="o-sub-section"><a href="#section-fonts">Fonts</a></div>
        <div className="o-sub-section"><a href="#section-text-mixins">Text Mixins</a></div>
        <div className="o-sub-section"><a href="#section-text-colors">Text Colors</a></div>
        <div><a href="#section-color">Color</a></div>
        <div className="o-sub-section"><a href="#section-loopla-colors">Loopla Colors</a></div>
        <div className="o-sub-section"><a href="#section-grays">Grays</a></div>
      </div>

      <div className="o-section">
        <h1 id="section-text">Text</h1>

        <h2 id="section-fonts">Fonts</h2>
        Font 1
        <div className="o-font-1-lg o-caps">The quick brown fox jumps over the lazy dog.</div>
        <div className="o-font-1-lg">The quick brown fox jumps over the lazy dog.<br/>0123456789</div>
        Font 2
        <div className="o-font-2-lg o-caps">The quick brown fox jumps over the lazy dog.</div>
        <div className="o-font-2-lg">The quick brown fox jumps over the lazy dog.<br/>0123456789</div>


        <h2 id="section-text-mixins">Text Mixins</h2>
        <div className="o-heading">This is a Heading</div>
        <div className="o-subheading">This is a Subheading</div>
        <div className="o-body-text">
          This is body text. Similar hide-covered vibrating and voice-changing instruments have been used in 
          Africa for hundreds of years, often for ceremonial purposes. A popular belief is that Alabama Vest, 
          an African-American in Macon, Georgia, was the one who invented the kazoo around 1840, although 
          there is no documentation to support that claim.[2] The story originated with the Kaminsky 
          International Kazoo Quartet, a group of satirical kazoo players, which may cast doubt on the 
          veracity of the story,[3] as does the name "Alabama Vest" itself.
        </div>

        <h2 id="section-text-colors">Text Colors</h2>
        <div className="o-text-color-title">Title Text Color</div>
        <div className="o-text-color">Body Text Color</div>
        <div className="o-text-color-light">Light Text Color</div>
        <div className="o-text-color-medium">Medium Text Color</div>
        <div className="o-text-color-dark">Dark Text Color</div>
        <div className="o-text-color-link">Link Text Color</div>
      </div>

      <div className="o-section">
        <h1 id="section-color">Color</h1>

        <h2 id="section-loopla-colors">Loopla Colors</h2>
        <div className="color-loopla-1">Loopla 1</div>
        <div className="color-loopla-2">Loopla 2</div>
        <div className="color-loopla-3">Loopla 3</div>
        <div className="color-loopla-4">Loopla 4</div>
        <div className="color-loopla-5">Loopla 5</div>
        <div className="color-loopla-6">Loopla 6</div>

        <h2 id="section-grays">Grays</h2>
        <div className="color-box-0">White</div>
        <div className="color-box-1">Gray 100</div>
        <div className="color-box-2">Gray 200</div>
        <div className="color-box-3">Gray 300</div>
        <div className="color-box-4">Gray 400</div>
        <div className="color-box-5">Gray 500</div>
        <div className="color-box-6">Gray 600</div>
        <div className="color-box-7">Gray 700</div>
        <div className="color-box-8">Gray 800</div>
        <div className="color-box-9">Gray 900</div>
        <div className="color-box-10">Black</div>
      </div>
      
    </div>
  </PageInitializer>
);

export default DocumentationPage;
