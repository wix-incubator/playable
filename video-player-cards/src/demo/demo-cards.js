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
    contentNode: createCard('Card 1', 'Buy Now ->', 'https://scontent-frx5-1.cdninstagram.com/t51.2885-15/e35/16123864_171964476622622_1055696102294028288_n.jpg'),
    from: 0,
    to: 15000,
    order: 1,
    clientId: 1
  };

  const card2 = {
    contentNode: createCard('Card 2', 'Some Action ->'),
    from: 0,
    to: 15000,
    order: 2,
    clientId: 2
  };

  const card3 = {
    contentNode: createCard('Card 3', 'Watch Next ->'),
    from: 2000,
    to: 60000,
    order: 3,
    clientId: 3
  };

  const card4 = {
    contentNode: createCard('Card 4', 'Watch Next ->'),
    from: 2000,
    to: 60000,
    order: 4,
    clientId: 4
  };

  const card5 = {
    contentNode: createCard('Card 5', 'Watch More ->'),
    from: 2000,
    to: 60000,
    order: 5,
    clientId: 5
  };

  return [card1, card2, card3, card4, card5];
}
