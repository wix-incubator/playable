import styles from './demo-cards.scss';

function createCard(title, text, img) {
  const node = document.createElement('div');
  node.className = styles.card;

  const contentNode = document.createElement('div');
  contentNode.className = styles.content;

  const titleNode = document.createElement('div');
  titleNode.className = styles.title;
  titleNode.innerHTML = title;
  const textNode = document.createElement('div');
  textNode.className = styles.text;
  textNode.innerHTML = text;

  contentNode.appendChild(titleNode);
  contentNode.appendChild(textNode);

  if (img) {
    const imgNode = document.createElement('img');
    imgNode.className = styles.img;
    imgNode.setAttribute('src', img);

    node.appendChild(imgNode);
  }

  node.appendChild(contentNode);

  return node;
}

export function getDemoCards() {
  const card1Node = document.createElement('div');
  card1Node.className = styles.card1;

  const card1 = {
    contentNode: createCard('Test card', 'Test title lOrem ipsuim pisuinipsum.', 'https://scontent-frx5-1.cdninstagram.com/t51.2885-15/e35/16123864_171964476622622_1055696102294028288_n.jpg'),
    from: 0,
    to: 30000
  };

  const card11 = {
    contentNode: createCard('Test card 2!!!', 'It\'s another card, boy!'),
    from: 5000,
    to: 30000
  };

  const card1111Node = document.createElement('div');
  card1111Node.className = styles.card5;

  const card1111 = {
    contentNode: createCard('Test card3', 'Test title lOrem ipsuim pisuinipsum.', 'https://scontent-frx5-1.cdninstagram.com/t51.2885-15/e35/20590144_1012019698938562_2521454400447184896_n.jpg'),
    from: 8000,
    to: 30000
  };

  const card4Node = document.createElement('div');
  card4Node.className = styles.card4;

  const card4 = {
    contentNode: card4Node,
    from: 15000,
    to: 30000
  };

  const card5Node = document.createElement('div');
  card5Node.className = styles.card5;

  const card5 = {
    contentNode: card5Node,
    from: 20000,
    to: 30000
  };

  return [card1, card11, card1111, card4, card5];
}

