export interface AthleteMaster {
      name: string;
      nameEn: string;
      competitorId: string;
      sectorCode: string;
      discipline: string;
      subDiscipline: string;
      birthYear: string;
      gender: 'M' | 'F';
      team: string;
      profileUrl: string;
}

export const athletesMaster: AthleteMaster[] = [
      // 프리스타일 스키 하프파이프·슬로프스타일
      {
            name: "이승훈",
            nameEn: "LEE Seunghoon",
            competitorId: "235622",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "HP/SS",
            birthYear: "2005",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=235622&type=result"
      },
      {
            name: "문희성",
            nameEn: "MOON Heesung",
            competitorId: "239278",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "HP/SS",
            birthYear: "2006",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=239278&type=result"
      },
      {
            name: "신영섭",
            nameEn: "SHIN Youngseop",
            competitorId: "233691",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "HP/SS",
            birthYear: "2005",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=233691&type=result"
      },
      {
            name: "장유진",
            nameEn: "JANG Yujin",
            competitorId: "203633",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "HP/SS",
            birthYear: "2001",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=203633&type=result"
      },
      {
            name: "김다은",
            nameEn: "KIM Daeun",
            competitorId: "235623",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "HP/SS",
            birthYear: "2005",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=235623&type=result"
      },

      // 프리스타일 모글
      {
            name: "정대윤",
            nameEn: "JUNG Daeyoon",
            competitorId: "229480",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "MO",
            birthYear: "2005",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=229480&type=result"
      },
      {
            name: "이윤승",
            nameEn: "LEE Yoonseung",
            competitorId: "252896",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "MO",
            birthYear: "2006",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=252896&type=result"
      },
      {
            name: "윤신이",
            nameEn: "YOON Shini",
            competitorId: "258758",
            sectorCode: "FS",
            discipline: "Freestyle Ski",
            subDiscipline: "MO",
            birthYear: "2007",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=258758&type=result"
      },

      // 스노보드 알파인
      {
            name: "이상호",
            nameEn: "LEE Sangho",
            competitorId: "163744",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "Alpine",
            birthYear: "1995",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=163744&type=result"
      },
      {
            name: "김상겸",
            nameEn: "KIM Sangkyum",
            competitorId: "111837",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "Alpine",
            birthYear: "1989",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=111837&type=result"
      },
      {
            name: "조완희",
            nameEn: "JO Wanhee",
            competitorId: "188938",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "Alpine",
            birthYear: "1998",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=188938&type=result"
      },
      {
            name: "마준호",
            nameEn: "MA Junho",
            competitorId: "220950",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "Alpine",
            birthYear: "2002",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=220950&type=result"
      },
      {
            name: "홍승영",
            nameEn: "HONG Seungyoung",
            competitorId: "188936",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "Alpine",
            birthYear: "1998",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=188936&type=result"
      },
      {
            name: "정해림",
            nameEn: "JUNG Haerim",
            competitorId: "156415",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "Alpine",
            birthYear: "1995",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=156415&type=result"
      },

      // 스노보드 크로스
      {
            name: "우수빈",
            nameEn: "WOO Subin",
            competitorId: "229485",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "SBX",
            birthYear: "2003",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=229485&type=result"
      },

      // 스노보드 하프파이프·슬로프스타일·빅에어
      {
            name: "이채운",
            nameEn: "LEE Chaewoon",
            competitorId: "239112",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "HP/SS/BA",
            birthYear: "2006",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=239112&type=result"
      },
      {
            name: "이지오",
            nameEn: "LEE Jio",
            competitorId: "261333",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "HP/SS/BA",
            birthYear: "2008",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=261333&type=result"
      },
      {
            name: "김건희",
            nameEn: "KIM Geonhee",
            competitorId: "261977",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "HP/SS/BA",
            birthYear: "2008",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=261977&type=result"
      },
      {
            name: "최가온",
            nameEn: "CHOI Gaon",
            competitorId: "264594",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "HP/SS/BA",
            birthYear: "2008",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=264594&type=result"
      },
      {
            name: "이나윤",
            nameEn: "LEE Nayoon",
            competitorId: "212759",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "HP/SS/BA",
            birthYear: "2003",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=212759&type=result"
      },
      {
            name: "이동헌",
            nameEn: "LEE Dongheon",
            competitorId: "239111",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "HP/SS/BA",
            birthYear: "2006",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=239111&type=result"
      },
      {
            name: "유승은",
            nameEn: "YOO Seungeun",
            competitorId: "261339",
            sectorCode: "SB",
            discipline: "Snowboard",
            subDiscipline: "HP/SS/BA",
            birthYear: "2008",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=SB&competitorid=261339&type=result"
      },

      // 스키점프
      {
            name: "최흥철",
            nameEn: "CHOI Heungchul",
            competitorId: "10064",
            sectorCode: "JP",
            discipline: "Ski Jump",
            subDiscipline: "Ski Jump",
            birthYear: "1981",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=JP&competitorid=10064&type=result"
      },
      {
            name: "장선웅",
            nameEn: "JANG Sunwoong",
            competitorId: "270266",
            sectorCode: "JP",
            discipline: "Ski Jump",
            subDiscipline: "Ski Jump",
            birthYear: "2007",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=JP&competitorid=270266&type=result"
      },

      // 크로스컨트리
      {
            name: "이준서",
            nameEn: "LEE Joonseo",
            competitorId: "229479",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "2003",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=229479&type=result"
      },
      {
            name: "변지영",
            nameEn: "BYUN Jiyoung",
            competitorId: "188923",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "1998",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=188923&type=result"
      },
      {
            name: "이진복",
            nameEn: "LEE Jinbok",
            competitorId: "229490",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "2002",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=229490&type=result"
      },
      {
            name: "정종원",
            nameEn: "JUNG Jongwon",
            competitorId: "136287",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "1992",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=136287&type=result"
      },
      {
            name: "이건용",
            nameEn: "LEE Geonyong",
            competitorId: "154934",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "1993",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=154934&type=result"
      },
      {
            name: "이의진",
            nameEn: "LEE Euijin",
            competitorId: "221223",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "2001",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=221223&type=result"
      },
      {
            name: "한다솜",
            nameEn: "HAN Dasom",
            competitorId: "162284",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "1994",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=162284&type=result"
      },
      {
            name: "이지예",
            nameEn: "LEE Jiye",
            competitorId: "212563",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "2001",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=212563&type=result"
      },
      {
            name: "제상미",
            nameEn: "JE Sangmi",
            competitorId: "195562",
            sectorCode: "CC",
            discipline: "Cross Country",
            subDiscipline: "Cross Country",
            birthYear: "1999",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=CC&competitorid=195562&type=result"
      },

      // 알파인
      {
            name: "정동현",
            nameEn: "JUNG Donghyun",
            competitorId: "93945",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1988",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=93945&type=result"
      },
      {
            name: "박제윤",
            nameEn: "PARK Jeyoon",
            competitorId: "154866",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1994",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=154866&type=result"
      },
      {
            name: "홍동관",
            nameEn: "HONG Donggwan",
            competitorId: "163737",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1995",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=163737&type=result"
      },
      {
            name: "김동우",
            nameEn: "KIM Dongwoo",
            competitorId: "163740",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1995",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=163740&type=result"
      },
      {
            name: "정민식",
            nameEn: "JUNG Minsik",
            competitorId: "189170",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1997",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=189170&type=result"
      },
      {
            name: "이한희",
            nameEn: "LEE Hanhee",
            competitorId: "188824",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1997",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=188824&type=result"
      },
      {
            name: "신정우",
            nameEn: "SHIN Jungwoo",
            competitorId: "203604",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1999",
            gender: "M",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=203604&type=result"
      },
      {
            name: "김소희",
            nameEn: "KIM Sohee",
            competitorId: "177571",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "1996",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=177571&type=result"
      },
      {
            name: "최태희",
            nameEn: "CHOI Taehee",
            competitorId: "263315",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "2005",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=263315&type=result"
      },
      {
            name: "박서윤",
            nameEn: "PARK Seoyoon",
            competitorId: "261321",
            sectorCode: "AL",
            discipline: "Alpine",
            subDiscipline: "Alpine Skiing",
            birthYear: "2005",
            gender: "F",
            team: "대한스키협회",
            profileUrl: "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=261321&type=result"
      }
];
