export default async (page, selector) => {
  await page._client.send('DOM.enable');
  await page._client.send('CSS.enable');
  const doc = await page._client.send('DOM.getDocument');
  const { nodeId } = await page._client.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector,
  });

  const styleForSingleNode = await page._client.send(
    'CSS.getMatchedStylesForNode',
    { nodeId },
  );

  return styleForSingleNode.matchedCSSRules.reduce((prev, curr) => {
    const styles = Object.assign(
      ...curr.rule.style.cssProperties.map((rule) => ({
        [rule.name]: rule.value,
      })),
    );

    return { ...prev, ...styles };
  }, {});
};
