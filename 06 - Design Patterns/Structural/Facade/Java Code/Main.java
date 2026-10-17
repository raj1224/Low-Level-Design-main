// =============================================================================
// FACADE (Java twin of example.cpp) — VideoConverter exposes one convert() call
// over a complex demux/codec/mux subsystem.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================

// ---------- Complex subsystem ----------
class Demuxer {
    void extract(String file) {
        System.out.println("  [Demuxer] split " + file + " into raw video + audio");
    }
}
class VideoCodec {
    void decode() { System.out.println("  [VideoCodec] decode source frames"); }
    void encode(String target) { System.out.println("  [VideoCodec] encode frames to " + target); }
}
class AudioCodec {
    void transcode(String target) { System.out.println("  [AudioCodec] transcode audio for " + target); }
}
class Muxer {
    String combine(String name, String fmt) {
        String out = name + "." + fmt;
        System.out.println("  [Muxer] mux video+audio into " + out);
        return out;
    }
}

// ---------- Facade ----------
class VideoConverter {
    private Demuxer demuxer = new Demuxer();
    private VideoCodec video = new VideoCodec();
    private AudioCodec audio = new AudioCodec();
    private Muxer muxer = new Muxer();

    String convert(String file, String targetFormat) {
        System.out.println("Converting " + file + " -> " + targetFormat + ":");
        demuxer.extract(file);
        video.decode();
        video.encode(targetFormat);
        audio.transcode(targetFormat);
        String base = file.substring(0, file.indexOf('.'));
        return muxer.combine(base, targetFormat);
    }
}

public class Main {
    public static void main(String[] args) {
        VideoConverter converter = new VideoConverter();
        String result = converter.convert("holiday.mov", "mp4");
        System.out.println("Done -> " + result);
    }
}
