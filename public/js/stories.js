const STORIES = [
  {
    name: 'Asha',
    text:
      '“I joined the sustainability guild on ConnectU and instantly found three lab partners for our eco-hackathon.”',
  },
  {
    name: 'Diego',
    text:
      '“The mentor pairing matched me with a recent grad who reviewed my internship applications each week.”',
  },
  {
    name: 'Mina',
    text:
      '“I never miss cultural events now—ConnectU curates clubs that match my interests every Sunday night.”',
  },
];

export const initStories = () => {
  const storyText = document.querySelector('[data-story]');
  const storyStep = document.querySelector('[data-story-step]');
  const storyButton = document.querySelector('[data-story-button]');

  if (!storyText || !storyStep || !storyButton) return;

  let storyIndex = -1;

  storyButton.addEventListener('click', () => {
    storyIndex = (storyIndex + 1) % STORIES.length;
    const story = STORIES[storyIndex];
    storyText.textContent = story.text;
    storyStep.textContent = `Story ${storyIndex + 1} / ${STORIES.length}`;
    if (storyIndex === 0) {
      storyButton.textContent = 'Show another story';
    }
  });
};
