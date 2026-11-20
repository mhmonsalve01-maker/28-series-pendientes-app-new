import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

import { procesarInclinacion, type DecisionInclinacion } from '../services/inclinacion';

export type EstadoInclinacion = 'apagado' | 'iniciando' | 'listo' | 'no-disponible' | 'sin-permiso';

// Si al probar en tu teléfono izquierda y derecha salen invertidas, cambia a -1.
const SIGNO = 1;

export function useInclinacion(
  activo: boolean,
  onDecision: (decision: DecisionInclinacion) => void,
): EstadoInclinacion {
  const [estado, setEstado] = useState<Exclude<EstadoInclinacion, 'apagado'>>('iniciando');
  const callback = useRef(onDecision);

  useEffect(() => {
    callback.current = onDecision;
  });

  useEffect(() => {
    if (!activo) return;
    let cancelado = false;
    let suscripcion: { remove: () => void } | null = null;

    async function iniciar() {
      try {
        if (!(await DeviceMotion.isAvailableAsync())) {
          if (!cancelado) setEstado('no-disponible');
          return;
        }
        const permiso = await DeviceMotion.requestPermissionsAsync();
        if (!permiso.granted) {
          if (!cancelado) setEstado('sin-permiso');
          return;
        }
        if (cancelado) return;
        DeviceMotion.setUpdateInterval(100);
        let armado = false;
        suscripcion = DeviceMotion.addListener((datos) => {
          const gamma = datos.rotation?.gamma;
          if (gamma === undefined) return;
          const r = procesarInclinacion(armado, gamma * SIGNO);
          armado = r.armado;
          if (r.decision) callback.current(r.decision);
        });
        setEstado('listo');
      } catch {
        if (!cancelado) setEstado('no-disponible');
      }
    }

    void iniciar();
    return () => {
      cancelado = true;
      suscripcion?.remove();
    };
  }, [activo]);

  return activo ? estado : 'apagado';
}
