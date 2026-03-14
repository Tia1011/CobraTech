function rollDice(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
const rollDice6 = () => rollDice(1, 6);
print (rollDice6);