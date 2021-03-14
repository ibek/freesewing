export default (part) => {
  // Shorthand
  let {
    points,
    Point,
    paths,
    Path,
    measurements,
    options,
    complete,
    paperless,
    store,
    macro,
    utils,
    snippets,
    Snippet,
    sa
  } = part.shorthand()

  // Clean up
  for (let id in paths) delete paths[id]
  for (let id in snippets) delete snippets[id]

  paths.saBase = new Path()
    .move(points.facingTop)
    .line(points.slantTop)
    .line(points.slantCurveStart)
    .join(
      new Path()
        .move(points.slantCurveStart)
        .curve(points.slantCurveCp1, points.slantCurveCp2, points.slantCurveEnd)
        .curve(points.pocketbagBottomCp1, points.pocketbagBottomCp2, points.pocketbagBottom)
        .split(points.facingBottom)
        .shift()
    )
  paths.seam = paths.saBase.clone().line(points.facingTop).close().attr('class', 'fabric', true)

  if (complete) {
    points.titleAnchor = points.slantBottomNotch.shift(0, 10)
    macro('title', {
      at: points.titleAnchor,
      nr: 7,
      title: 'frontPocketBagFacing'
    })
    macro('grainline', {
      from: points.slantTop,
      to: new Point(points.slantTop.x, points.facingDirection.y)
    })

    if (sa) {
      paths.sa = paths.saBase.clone().offset(sa).line(points.facingBottom)
      // Can't call start() if we don't store the result
      paths.sa = paths.sa.move(paths.sa.start()).line(points.facingTop).attr('class', 'fabric sa')
    }

    if (paperless) {
    }
  }

  return part
}
