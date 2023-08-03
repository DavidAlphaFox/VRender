# Change Log - @visactor/vrender-components

This log was last generated on Wed, 02 Aug 2023 03:13:00 GMT and should not be manually modified.

## 0.13.7
Wed, 02 Aug 2023 03:13:00 GMT

### Patches

- feat(chore): trigger publish
- fix(legend): when discrete legend's item's width does not exceed maxWidth, it should use its own width, fix:https://github.com/VisActor/VChart/issues/300

## 0.13.6
Fri, 28 Jul 2023 07:17:04 GMT

### Patches

- Merge pull request #225 from VisActor/sync-0.13.5

Sync 0.13.5


## 0.13.5
Thu, 27 Jul 2023 12:27:43 GMT

### Patches

- feat(component): label component support custom layout and dataFilter
- fix: fix the issue of using interactive layer in only on canvas env

## 0.13.4
Tue, 25 Jul 2023 13:33:47 GMT

_Version update only_

## 0.13.3
Tue, 25 Jul 2023 07:34:59 GMT

### Patches

- feat(vrender-components): discreate legend's item's state style supports function
- feat(vrender-components): axis label, tick and subTick's state style supports function
- fix: fix the issue of maxLineWidth's value is negative

## 0.13.2
Fri, 21 Jul 2023 10:50:41 GMT

### Patches

- fix(vrender-components): fix the calculation of axis title offset
- fix(vrender-components): fix the issue of bounds when labelContainer is empty

## 0.13.1
Thu, 20 Jul 2023 10:41:23 GMT

### Patches

- fix: fix the offset of axis title

## 0.13.0
Wed, 19 Jul 2023 08:29:52 GMT

### Minor changes

- feat(axis): support `dataFilter` property for tick and label's data filter
- feat(axis): add anti-overlapping logic for cartesian axis labels
- feat: support poptip component and plugin

### Patches

- feat(axis): support custom method for autohide
- feat: tooltip supports rich text which can wrap
- fix(legend): compact the undefiend scene when use Object.keys

## 0.12.3
Wed, 12 Jul 2023 12:30:46 GMT

_Version update only_

## 0.12.2
Tue, 11 Jul 2023 13:17:12 GMT

### Patches

- fix(components): fix a layout issue when legend item is larger than maxWidth
- fix(components): adjust the drawing level of grid and subGrid
- fix: set the pickMode of pager handler to imprecise to improve the click in mobile
- chore: remove gl-matrix

## 0.12.1
Fri, 07 Jul 2023 09:04:45 GMT

### Patches

- fix: check label inside in smartInvert 

## 0.12.0
Thu, 06 Jul 2023 09:09:12 GMT

### Minor changes

- refactor: refactor interfaces and types of typescript

### Patches

- fix: tooltip should not throw error when title not exist



## 0.11.1
Tue, 27 Jun 2023 13:38:36 GMT

_Version update only_

## 0.11.0
Tue, 27 Jun 2023 03:18:18 GMT

### Minor changes

- update vUtils version
- rename all of the borderRadius to cornerRadius

### Patches

- fix the position offset of the tooltip content shape

## 0.10.3
Tue, 20 Jun 2023 06:23:42 GMT

_Version update only_

## 0.10.2
Tue, 20 Jun 2023 03:25:23 GMT

_Version update only_

## 0.10.1
Mon, 19 Jun 2023 09:49:38 GMT

### Patches

- limit the range of dragMask, it should not exceeded the display range of datazoom

## 0.10.0
Fri, 16 Jun 2023 03:13:09 GMT

### Minor changes

- code style
- export version

### Patches

- upgrade vrender
- fix enableView3dTranform
- fix legend shape's color does not change in unselected state
- upgrade vrender

## 0.9.1
Thu, 08 Jun 2023 11:34:32 GMT

_Version update only_

## 0.9.0
Wed, 07 Jun 2023 12:20:05 GMT

_Initial release_

