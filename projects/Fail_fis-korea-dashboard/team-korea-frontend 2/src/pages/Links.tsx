// src/pages/Links.tsx
import { Card } from '../components/common/Card';
import { motion } from 'framer-motion';

const LINKS = [
  {
    name: '대한스키협회',
    url: 'http://www.ski.or.kr',
    icon: '⛷️',
    description: 'Korea Ski Association',
    color: 'from-korea-red to-korea-red-dark',
  },
  {
    name: 'FIS 공식',
    url: 'https://www.fis-ski.com',
    icon: '🏔️',
    description: 'International Ski Federation',
    color: 'from-korea-blue to-korea-blue-dark',
  },
  {
    name: '대한체육회',
    url: 'https://www.sports.or.kr',
    icon: '🇰🇷',
    description: 'Korean Sport & Olympic Committee',
    color: 'from-gold to-gold-dark',
  },
  {
    name: '올림픽 공식',
    url: 'https://olympics.com',
    icon: '🏅',
    description: 'Olympic Games',
    color: 'from-blue-500 to-purple-500',
  },
];

export const Links = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold gradient-text mb-2">🔗 링크 허브</h1>
        <p className="text-gray-600">관련 기관 및 공식 사이트</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {LINKS.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="h-full text-center hover:shadow-2xl">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${link.color} flex items-center justify-center text-4xl`}>
                {link.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{link.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{link.description}</p>
              <div className="text-korea-blue text-sm font-semibold">
                바로가기 →
              </div>
            </Card>
          </motion.a>
        ))}
      </div>

      {/* 추가 정보 */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
        <h3 className="text-xl font-bold mb-4">📌 유용한 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2">🗓️ 2026 올림픽 일정</h4>
            <p className="text-sm text-gray-600">
              2026년 2월 6일 - 2월 22일
              <br />
              밀라노-코르티나 담페초, 이탈리아
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2">📺 중계 정보</h4>
            <p className="text-sm text-gray-600">
              KBS, SBS, MBC 등 지상파 채널
              <br />
              JTBC, 스포티비 등 종합편성·케이블 채널
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2">🎿 주요 종목</h4>
            <p className="text-sm text-gray-600">
              알파인 스키, 프리스타일, 스노보드
              <br />
              크로스컨트리, 스키점프 등
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2">🏆 목표</h4>
            <p className="text-sm text-gray-600">
              종합 15위권
              <br />
              메달 5개 이상
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
