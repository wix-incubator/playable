import styles from './demo-cards.scss';

export function getDemoCards() {
  const card1Node = document.createElement('div');
  card1Node.className = styles.card1;

  const card1 = {
    contentNode: card1Node,
    appearance: {
      duration: 10,
      start: 0
    }
  };

  const card11Node = document.createElement('div');
  card11Node.className = styles.card3;

  const card11 = {
    contentNode: card11Node,
    appearance: {
      duration: 10,
      start: 0
    }
  };

  const card111Node = document.createElement('div');
  card111Node.className = styles.card4;

  const card111 = {
    contentNode: card111Node,
    appearance: {
      duration: 10,
      start: 0
    }
  };

  const card1111Node = document.createElement('div');
  card1111Node.className = styles.card5;

  const card1111 = {
    contentNode: card1111Node,
    appearance: {
      duration: 10,
      start: 0
    }
  };

  const card2Node = document.createElement('div');
  card2Node.className = styles.card2;

  const card2 = {
    contentNode: card2Node,
    appearance: {
      duration: 10,
      start: 5.5
    }
  };

  const card3Node = document.createElement('div');
  card3Node.className = styles.card3;

  const card3 = {
    contentNode: card3Node,
    appearance: {
      duration: 10,
      start: 10.3
    }
  };

  const card4Node = document.createElement('div');
  card4Node.className = styles.card4;

  const card4 = {
    contentNode: card4Node,
    appearance: {
      duration: 10,
      start: 15
    }
  };

  const card5Node = document.createElement('div');
  card5Node.className = styles.card5;

  const card5 = {
    contentNode: card5Node,
    appearance: {
      duration: 10,
      start: 20
    }
  };

  return [card1, card11, card111, card1111, card2, card3, card4, card5];
}

