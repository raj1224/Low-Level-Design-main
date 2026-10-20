
// =============================================================================
// FACADE — provide a single, simplified interface to a complex subsystem. The
// facade does the orchestration; clients get a one-call "front door" and don't
// need to know the subsystem's many classes or the order to call them in.
//
// Domain: converting a video. Real conversion touches a demuxer, a video codec,
// an audio codec, and a muxer. A VideoConverter facade exposes one convert()
// call and hides the choreography.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Complex subsystem (many classes, intricate steps) ----------
class Demuxer {
    extract(file) {
        console.log(
            `  [Demuxer] split ${file} into raw video + audio`
        );
    }
}

class VideoCodec {
    decode() {
        console.log("  [VideoCodec] decode source frames");
    }

    encode(target) {
        console.log(
            `  [VideoCodec] encode frames to ${target}`
        );
    }
}

class AudioCodec {
    transcode(target) {
        console.log(
            `  [AudioCodec] transcode audio for ${target}`
        );
    }
}

class Muxer {
    combine(name, fmt) {
        const output = `${name}.${fmt}`;

        console.log(
            `  [Muxer] mux video+audio into ${output}`
        );

        return output;
    }
}

// ---------- Facade: one simple operation over the whole subsystem ----------
class VideoConverter {
    constructor() {
        this.demuxer = new Demuxer();
        this.video = new VideoCodec();
        this.audio = new AudioCodec();
        this.muxer = new Muxer();
    }

    convert(file, targetFormat) {
        console.log(`Converting ${file} -> ${targetFormat}:`);

        this.demuxer.extract(file);
        this.video.decode();
        this.video.encode(targetFormat);
        this.audio.transcode(targetFormat);

        const base = file.substring(0, file.indexOf("."));

        return this.muxer.combine(base, targetFormat);
    }
}

function main() {
    // The client makes ONE call and stays blissfully unaware of the subsystem.
    const converter = new VideoConverter();

    const result = converter.convert("holiday.mov", "mp4");

    console.log(`Done -> ${result}`);
}

main();
