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
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// ---------- Complex subsystem (many classes, intricate steps) ----------
class Demuxer {
public:
    void extract(string file) {
        cout << "  [Demuxer] split " << file << " into raw video + audio" << endl;
    }
};
class VideoCodec {
public:
    void decode() { cout << "  [VideoCodec] decode source frames" << endl; }
    void encode(string target) { cout << "  [VideoCodec] encode frames to " << target << endl; }
};
class AudioCodec {
public:
    void transcode(string target) { cout << "  [AudioCodec] transcode audio for " << target << endl; }
};
class Muxer {
public:
    string combine(string name, string fmt) {
        string out = name + "." + fmt;
        cout << "  [Muxer] mux video+audio into " << out << endl;
        return out;
    }
};

// ---------- Facade: one simple operation over the whole subsystem ----------
class VideoConverter {
private:
    Demuxer demuxer;
    VideoCodec video;
    AudioCodec audio;
    Muxer muxer;
public:
    string convert(string file, string targetFormat) {
        cout << "Converting " << file << " -> " << targetFormat << ":" << endl;
        this->demuxer.extract(file);
        this->video.decode();
        this->video.encode(targetFormat);
        this->audio.transcode(targetFormat);
        string base = file.substr(0, file.find('.'));
        return this->muxer.combine(base, targetFormat);
    }
};

int main() {
    // The client makes ONE call and stays blissfully unaware of the subsystem.
    VideoConverter* converter = new VideoConverter();
    string result = converter->convert("holiday.mov", "mp4");
    cout << "Done -> " << result << endl;
    delete converter;
    return 0;
}
