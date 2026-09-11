"use client";
import type { ReactGridPluginId } from "@/components/home/demo/DemoPluginSelect";
import { ExamplePreviewProvider } from "@/components/example-preview/ExamplePreviewContext";
import { DemoWindow } from "@/components/home/demo/DemoWindow";
import {
  withCustomLocalDataChannelName,
  withLocalDataEditorHidden,
  type PersistentBroadcastMessage,
} from "@jsoc/grid-examples-core";
import { useSetLocalData } from "@jsoc/react-grid-examples";
import { useEffect, useRef, useState } from "react";

const DEMO_PAYLOADS = [
  "{}",
  '{"a": 1}',
  '{"a": 1, "b": 2 }',
  '{"a": 1, "b": {"c": 2}}',
];

const CHANNEL = "hero-demo";
const INITIAL_DELAY_MS = 3000;
const PAUSE_AFTER_COMPLETE_MS = 2500;
const TYPE_SPEED_MS = 100;

const transformPreviewUrl = (url: string) =>
  withLocalDataEditorHidden(withCustomLocalDataChannelName(url, CHANNEL));

export function Demo() {
  const [pluginId, setPluginId] = useState<ReactGridPluginId>("tanstack");
  const [payloadIndex, setPayloadIndex] = useState(0);
  const [broadcastedData, setBroadcastedData] =
    useState<PersistentBroadcastMessage>(undefined);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [hasInitialDelayElapsed, setHasInitialDelayElapsed] = useState(false);
  // Remaining dwell time before advancing, so pause/resume freezes the
  // wait instead of restarting it. Refs only — no re-renders involved.
  const waitRemainingRef = useRef(PAUSE_AFTER_COMPLETE_MS);
  const waitStartRef = useRef<number | null>(null);
  useSetLocalData(broadcastedData, CHANNEL);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInitialDelayElapsed(true);
    }, INITIAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const isPaused = isUserPaused || !hasInitialDelayElapsed;
  const targetPayload = DEMO_PAYLOADS[payloadIndex];
  // True once typing completes and the preview is in sync. The dark timer
  // fill stays mounted for the whole dwell phase and is only frozen
  // (not removed) while paused.
  const isStepComplete = broadcastedData === targetPayload;

  const handleTypeComplete = () => {
    setBroadcastedData(targetPayload);
  };

  useEffect(() => {
    if (isPaused || broadcastedData !== targetPayload) {
      waitStartRef.current = null;
      if (broadcastedData !== targetPayload) {
        waitRemainingRef.current = PAUSE_AFTER_COMPLETE_MS;
      }
      return;
    }

    waitStartRef.current = Date.now();
    const timer = setTimeout(() => {
      waitStartRef.current = null;
      waitRemainingRef.current = PAUSE_AFTER_COMPLETE_MS;
      setPayloadIndex((prev) => (prev + 1) % DEMO_PAYLOADS.length);
    }, waitRemainingRef.current);

    return () => {
      clearTimeout(timer);
      // Freeze the dwell clock so resume continues where it left off.
      if (waitStartRef.current !== null) {
        waitRemainingRef.current = Math.max(
          0,
          waitRemainingRef.current - (Date.now() - waitStartRef.current),
        );
        waitStartRef.current = null;
      }
    };
  }, [broadcastedData, targetPayload, isPaused]);

  return (
    <ExamplePreviewProvider
      adapterId="react-grid"
      pluginId={pluginId}
      exampleId="localData"
      transformPreviewUrl={transformPreviewUrl}
    >
      <DemoWindow
        data={targetPayload}
        stepIndex={payloadIndex}
        stepCount={DEMO_PAYLOADS.length}
        isPaused={isPaused}
        isUserPaused={isUserPaused}
        isStepComplete={isStepComplete}
        waitMs={PAUSE_AFTER_COMPLETE_MS}
        typeSpeedMs={TYPE_SPEED_MS}
        pluginId={pluginId}
        onSelectPlugin={setPluginId}
        onTogglePause={() => setIsUserPaused((prev) => !prev)}
        onSelectStep={setPayloadIndex}
        onTypeComplete={handleTypeComplete}
      />
    </ExamplePreviewProvider>
  );
}
