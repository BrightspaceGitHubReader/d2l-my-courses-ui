# Performance Timings

As my-courses renders, various performance timings are tracked and are exposed through the [Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API).

![my courses request timeline](/images/request-timeline.png?raw=true)

To see the marks & measures, run this in your browser console:
```javascript
window.performance.getEntriesByType('mark')
	.filter(function(e) { return e.name.indexOf('my-courses') > -1; });
performance.getEntriesByType('measure')
	.filter(function(e) { return e.name.indexOf('my-courses') > -1; });
```

## Marks

| Mark | Description |
| ---- | ----------- |
| `d2l.my-courses.attached` | Polymer `attached()` called. First opportunity for my-courses to do work. |
| `d2l.my-courses.root-enrollments.request` | Request initiated to enrollments root API. |
| `d2l.my-courses.root-enrollments.response` | Response received from enrollments root API. |
| `d2l.my-courses.search-enrollments.request` | Request initiated to enrollments search API. |
| `d2l.my-courses.search-enrollments.response` | Response received from enrollments search API. |
| `d2l.my-courses.visible-images-complete` | All course images in viewport have loaded. |
| `d2l.my-courses.visible-organizations-complete` | Information has loaded for all courses in viewport (excluding images). |
| `d2l.my-courses.all-organizations-complete` | Information has loaded for all courses (excluding images). |

## Measures

| Measure | Description | Start Mark | End Mark |
| ------- | ----------- | ---------- | -------- |
| `d2l.my-courses.root-enrollments` | Duration of the enrollments root API request. Often includes time to fetch token. | `d2l.my-courses.root-enrollments.request` | `d2l.my-courses.root-enrollments.response` |
| `d2l.my-courses.search-enrollments` | Duration of the enrollments search API request. | `d2l.my-courses.search-enrollments.request` | `d2l.my-courses.search-enrollments.response` |
| `d2l.my-courses.meaningful.visible` | Approximation of total time for my-courses to be usable for a sighted user (visible organizations, excludes course images). | `d2l.my-courses.attached` | `d2l.my-courses.visible-organizations-complete` |
| `d2l.my-courses.hero` | Approximation of total time for my-courses to complete loading for a sighted user (visible organizations and course images). Roughly corresponds to "hero element" timing. | `d2l.my-courses.attached` | `d2l.my-courses.visible-images-complete` |
| `d2l.my-courses.meaningful.all` | Approximation of total time for my-courses to complete loading for a screenreader user (all organizations, excludes course images) | `d2l.my-courses.attached` | `d2l.my-courses.all-organizations-complete` |

Course images are lazy-loaded only once they become visible in the viewport. Because of this, we do not track "last course image loaded" as it's possible that this would never occur, should the user not scroll down far enough for all images to enter the viewport and therefore load.

Note that the two visibility-related measures will be recorded almost immediately if the widget is not in the viewport at all - the idea being that if the widget is initially down the page, we can effectively say we've immediately loaded all the visible content.
