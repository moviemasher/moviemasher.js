

export type Panel = BrowserPanel | PlayerPanel | InspectorPanel | TimelinePanel;

export type BrowserPanel = 'browser';
export type PlayerPanel = 'player';
export type InspectorPanel = 'inspector';
export type TimelinePanel = 'timeline';

export const PanelBrowser: Panel = 'browser';
export const PanelPlayer: Panel = 'player';
export const PanelInspector: Panel = 'inspector';
export const PanelTimeline: Panel = 'timeline';
