import { Platform, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapProps {
  latitude: number;
  longitude: number;
  onRegionChange?: (region: any) => void;
}

// Web-specific map implementation
function WebMap({ latitude, longitude }: MapProps) {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${latitude}, ${longitude}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          L.marker([${latitude}, ${longitude}]).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: mapHtml }}
      style={styles.map}
      scrollEnabled={false}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error:', nativeEvent);
      }}
    />
  );
}

// Native-specific map implementation
function NativeMap({ latitude, longitude }: MapProps) {
  if (Platform.OS === 'web') {
    return null;
  }

  // Use dynamic import to prevent the native module from being bundled on web
  const MapView = require('react-native-maps').default;
  const { Marker } = require('react-native-maps');

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
      <Marker
        coordinate={{
          latitude,
          longitude,
        }}
        title="Location"
      />
    </MapView>
  );
}

// Main Map component with platform-specific rendering
export default function Map(props: MapProps) {
  return (
    <View style={styles.container}>
      {Platform.select({
        web: <WebMap {...props} />,
        default: <NativeMap {...props} />,
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
});